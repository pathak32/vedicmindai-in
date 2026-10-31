// Hand-judged difficulty per Reasoning question: e = easy, m = medium, h = hard, one letter per
// question in the order it appears in the chapter. If a chapter's question count changes the
// string no longer fits and the chapter falls back to the rotating easy/medium/hard tags.
import { applyDifficultyMarks } from './aptDifficulty.js';

export const RA_L1_DIFFICULTY = {
  'odd-one-out': 'eeeeememee' + 'mmeeeemmmm' + 'mmmmmeeeee' + 'mmeeeemeee' + 'emmee',
  'number-series-basic': 'eeeeeemeee' + 'eeeeeemeee' + 'meeeeeemee' + 'eeemmmmehm' + 'meeeeeem',
  'analogies-basic': 'eeeeeeemem' + 'eeeemeemee' + 'emeememmee' + 'eeeemeemme' + 'eemmeeee',
  'ranking-ordering': 'eeeemmemee' + 'eeemmmeemm' + 'ememmemmem' + 'eemeemeeee' + 'meeemmee',
  'direction-basic': 'eeeeeemmem' + 'emeemmmmem' + 'emmmmmehhm' + 'ememhmhmmm' + 'mhmmmmhh',
  'coding-decoding-basic': 'memmmemmmm' + 'mmmmhhhmmm' + 'hheeeemmmh' + 'eeehmemmem' + 'emmemhhe',
  'calendar-basics': 'meemeeeemm' + 'mheemhmmme' + 'mheemmehhe' + 'hhhmhmmhhm' + 'mhmmhhem',
  'pattern-completion': 'eeeememeee' + 'eememememe' + 'memeememee' + 'emheeehehh' + 'eeheeehe',
  'blood-relations-basic': 'meeeeeehee' + 'eemeemmeee' + 'mmmmmmeemm' + 'mmmmmemhmm' + 'heememme',
  'mirror-images-basic': 'mheeeemmhh' + 'mmeeemeehm' + 'mmeememmmm' + 'mmmmmeemem' + 'eemmmeee',
};

export const RA_L2_DIFFICULTY = {
  'odd-one-out-l2': 'memmhemmhe' + 'hmmemmmemm' + 'mhmmmeee' + 'hmhmhhhmhm' + 'mhhmhmhmhm',
  'number-series-l2': 'eememehmem' + 'eemeeemmme' + 'hmhhmem' + 'hhhhhmhhhh' + 'mmhmmmhmmh',
  'analogies-l2': 'emmhhmeemm' + 'meeemmemee' + 'hhmhhmeh' + 'emeeememme' + 'mmmmemmeem',
  'ranking-ordering-l2': 'emhmhmhhem' + 'hmmhmhmmmm' + 'emhmhmmh' + 'emeeeeeeee' + 'eeeeeeemee',
  'direction-l2': 'memmmhhemm' + 'mmemmmemmh' + 'memmehemee' + 'eemeeeeeem' + 'eeemeeee',
  'coding-decoding-l2': 'hmmmmehmmm' + 'eemmmhhhhh' + 'hhmmmmemhh' + 'hmmmhhhmmmmhhmhhhh',
  'calendar-l2': 'mmmhhhmmee' + 'hhmhmhhmme' + 'hehemmmhhh' + 'mhmmhhhhhm' + 'hhhmmmh',
  'pattern-completion-l2': 'mmeeeemmhm' + 'emememehhe' + 'mhhmheehmm' + 'mmmmhmmmmhmmmmhmmm',
  'blood-relations-l2': 'hhehhhmehm' + 'hmehmmmhmh' + 'hhhmmhmmem' + 'emeeemmmmmemmmemme',
  'mirror-images-l2': 'hmmhheehhh' + 'hhhhhmeemm' + 'meeeemmeem' + 'mhhmmmmhhmhhhmmmhmme',
};

export const applyRaL1Difficulty = (questions) => applyDifficultyMarks(questions, RA_L1_DIFFICULTY);
export const applyRaL2Difficulty = (questions) => applyDifficultyMarks(questions, RA_L2_DIFFICULTY);
