// Aptitude quiz question bank — matches Reasoning's format (chapter/prompt/
// options/answer/exp), NOT the older aptitudeQuestions.js format (which uses
// a different topic/vedic_sutra structure for the pre-existing 46 questions).
//
// STATUS: structure ready, but empty — this needs the same merge pass already
// used for Reasoning and Vedic Maths: fetch his approved questions from
// pending_questions (vertical='Aptitude') and populate AITITUDE_QUESTIONS
// below. Ask Claude to do this merge once ready.

export const APTITUDE_QUESTIONS = [
  // Example shape for a text-based question (Primary/Middle/etc.):
  // { chapter: 'word-meanings', prompt: "Which word means the same as 'Happy'?", options: ['Sad','Joyful','Angry'], answer: 'Joyful', exp: '...' },

  // Example shape for a Pre-K image-based question:
  // { chapter: 'match-the-picture', prompt: 'Which picture matches the Apple?',
  //   options: [{label:'Apple',image:'https://...'}, {label:'Banana',image:'https://...'}],
  //   answer: 'Apple', exp: '...' },

  // Example shape for a Pre-K counting question:
  // { chapter: 'count-the-objects', prompt: 'How many Apples are there?',
  //   options: ['2','3','4'], answer: '3', exp: '...',
  //   display_image: 'https://...', display_count: 3 },

  // Example shape for a Pre-K pattern question:
  // { chapter: 'what-comes-next', prompt: 'What comes next in the picture pattern?',
  //   options: [{label:'Apple',image:'...'}, {label:'Banana',image:'...'}],
  //   answer: 'Apple', exp: '...', sequence_images: ['url1','url2','url3','url4'] },
];

export function getAptitudeQuestionsByChapter(chapterId) {
  return APTITUDE_QUESTIONS.filter((q) => q.chapter === chapterId);
}
