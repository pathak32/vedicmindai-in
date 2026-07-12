const fs = require('fs');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const CONCEPT_PATH = '/home/claude/repo/src/components/learn/ConceptTab.jsx';
const QUIZ_PATH = '/home/claude/repo/src/components/learn/QuizTab.jsx';
const PRACTICE_PATH = '/home/claude/repo/src/components/learn/PracticeTab.jsx';
const CURRICULUM_PATH = '/home/claude/repo/src/components/learn/curriculumData.jsx';

function parseFile(path) {
  const code = fs.readFileSync(path, 'utf8');
  return parser.parse(code, { sourceType: 'module', plugins: ['jsx'] });
}

// Resolve an AST node to a plain JS value. Handles string literals, template
// literals (no interpolation expected here), arrays, objects (bilingual
// {en,hi} -> takes .en), and JSX expression containers wrapping any of these.
function resolveValue(node) {
  if (!node) return null;
  if (node.type === 'JSXExpressionContainer') return resolveValue(node.expression);
  if (node.type === 'StringLiteral') return node.value;
  if (node.type === 'TemplateLiteral') {
    return node.quasis.map(q => q.value.cooked).join(' ... ');
  }
  if (node.type === 'NumericLiteral') return node.value;
  if (node.type === 'ArrayExpression') {
    return node.elements.map(el => resolveValue(el));
  }
  if (node.type === 'ObjectExpression') {
    const obj = {};
    for (const prop of node.properties) {
      if (prop.type !== 'ObjectProperty') continue;
      const key = prop.key.name || prop.key.value;
      obj[key] = resolveValue(prop.value);
    }
    // bilingual shorthand -> prefer English for the document
    if ('en' in obj) return obj.en;
    return obj;
  }
  if (node.type === 'JSXElement') {
    // e.g. inline SectionTitle children as {{ en: '...' }} handled above;
    // fallback: concatenate text children
    return node.children
      .map(c => (c.type === 'JSXText' ? c.value.trim() : resolveValue(c)))
      .filter(Boolean)
      .join(' ');
  }
  return null;
}

function getAttr(openingElement, name) {
  const attr = openingElement.attributes.find(a => a.name && a.name.name === name);
  if (!attr) return null;
  return resolveValue(attr.value);
}

function extractConceptBlocks(jsxRoot) {
  const blocks = [];
  function walk(node) {
    if (!node) return;
    if (Array.isArray(node)) { node.forEach(walk); return; }
    if (node.type === 'JSXElement') {
      const tagName = node.openingElement.name.name;
      if (tagName === 'SectionTitle') {
        const child = node.children.find(c => c.type === 'JSXExpressionContainer' || c.type === 'JSXText');
        const text = child ? (child.type === 'JSXText' ? child.value.trim() : resolveValue(child)) : null;
        if (text) blocks.push({ type: 'heading', text });
      } else if (tagName === 'StepBox') {
        blocks.push({
          type: 'step',
          number: getAttr(node.openingElement, 'number'),
          text: getAttr(node.openingElement, 'text'),
          example: getAttr(node.openingElement, 'example'),
        });
      } else if (tagName === 'ExampleCard') {
        blocks.push({
          type: 'example',
          title: getAttr(node.openingElement, 'title'),
          lines: getAttr(node.openingElement, 'lines'),
          result: getAttr(node.openingElement, 'result'),
          breakdown: getAttr(node.openingElement, 'breakdown'),
        });
      } else if (['OriginBox', 'WhyItWorksBox', 'CommonMistakeBox', 'RealWorldBox'].includes(tagName)) {
        blocks.push({ type: tagName, text: getAttr(node.openingElement, 'text') });
      } else if (tagName === 'p' || tagName === 'div') {
        // Fallback: grab plain-text-only prose (skip if it contains nested elements we already handle)
        const hasHandledChild = node.children.some(c => c.type === 'JSXElement' &&
          ['SectionTitle', 'StepBox', 'ExampleCard', 'OriginBox', 'WhyItWorksBox', 'CommonMistakeBox', 'RealWorldBox'].includes(c.openingElement.name.name));
        if (!hasHandledChild) {
          const text = node.children
            .map(c => c.type === 'JSXText' ? c.value.trim() : (c.type === 'JSXExpressionContainer' ? resolveValue(c) : ''))
            .filter(Boolean).join(' ').trim();
          if (text && text.length > 15) blocks.push({ type: 'prose', text });
        }
      }
      walk(node.children);
    } else if (node.type === 'JSXFragment') {
      walk(node.children);
    }
  }
  walk(jsxRoot);
  return blocks;
}

// ---- 1. Extract Concept content ----
const LEVEL4B_PATH = '/home/claude/repo/src/components/learn/ConceptTabLevel4B.jsx';
const conceptAst = parseFile(CONCEPT_PATH);
const level4bAst = parseFile(LEVEL4B_PATH);
const conceptContent = {}; // lessonId -> blocks[]
const varToBlocks = {}; // VAR_NAME -> blocks[] (for L1_01 special case + normal mapping)

function extractContentVars(ast) {
  traverse(ast, {
    VariableDeclarator(path) {
      const name = path.node.id.name;
      if (name && /^L\d+_\d+_CONTENT$/.test(name)) {
        const init = path.node.init;
        if (init && (init.type === 'JSXElement' || init.type === 'JSXFragment')) {
          varToBlocks[name] = extractConceptBlocks(init);
        }
      }
    },
  });
}
extractContentVars(conceptAst);
extractContentVars(level4bAst);

// LESSON_CONTENT map: l1_01: () => L1_01_CONTENT
traverse(conceptAst, {
  ObjectProperty(path) {
    if (path.parent.type === 'ObjectExpression') {
      const grandparent = path.parentPath.parent;
      if (grandparent.type === 'VariableDeclarator' && grandparent.id.name === 'LESSON_CONTENT') {
        const lessonId = path.node.key.name || path.node.key.value;
        // value is an arrow function returning an identifier
        const body = path.node.value.body;
        if (body && body.type === 'Identifier' && varToBlocks[body.name]) {
          conceptContent[lessonId] = varToBlocks[body.name];
        }
      }
    }
  },
});

// Special-case L1_01 (data + renderer pattern) — pull L1_01_DATA directly
traverse(conceptAst, {
  VariableDeclarator(path) {
    if (path.node.id.name === 'L1_01_DATA' && path.node.init.type === 'ObjectExpression') {
      const data = resolveValue(path.node.init);
      conceptContent['l1_01'] = [
        { type: 'heading', text: data.heading1 },
        { type: 'prose', text: data.intro },
        { type: 'heading', text: data.heading2 },
        ...((data.sutras || []).map(s => ({ type: 'prose', text: `${s.name} — "${s.meaning}" — Used for: ${s.use}` }))),
        { type: 'heading', text: data.heading3 },
        ...((data.steps || []).map((s, i) => ({ type: 'step', number: i + 1, text: s, example: null }))),
        { type: 'example', title: null, lines: [], result: data.resultLine },
      ];
    }
  },
});

fs.writeFileSync('/home/claude/concept_extracted.json', JSON.stringify(conceptContent, null, 2));
console.log('Concept lessons extracted:', Object.keys(conceptContent).length, Object.keys(conceptContent).join(', '));

// ---- 2. Extract Quiz content ----
const quizAst = parseFile(QUIZ_PATH);
let quizContent = {};
traverse(quizAst, {
  VariableDeclarator(path) {
    if (path.node.id.name === 'LESSON_QUESTIONS' && path.node.init.type === 'ObjectExpression') {
      quizContent = resolveValue(path.node.init);
    }
  },
});
fs.writeFileSync('/home/claude/quiz_extracted.json', JSON.stringify(quizContent, null, 2));
console.log('Quiz lessons extracted:', Object.keys(quizContent).length);

// ---- 3. Extract Practice content ----
const practiceAst = parseFile(PRACTICE_PATH);
let practiceContent = {};
traverse(practiceAst, {
  VariableDeclarator(path) {
    if (path.node.id.name === 'LESSON_PROBLEMS' && path.node.init.type === 'ObjectExpression') {
      practiceContent = resolveValue(path.node.init);
    }
  },
});
fs.writeFileSync('/home/claude/practice_extracted.json', JSON.stringify(practiceContent, null, 2));
console.log('Practice lessons extracted:', Object.keys(practiceContent).length);
