const messageLines = [
  'your story starts here.',
  'take your place in the story.',
  'this story is waiting for you.',
  'the next chapter starts when you arrive.',
  'a little theatre, a lot of heart—just for you.',
  'your seat in the story is ready.',
  'come curious; leave with a story to tell.',
  'the curtain rises on a moment made to share.',
  'you are part of what makes this story live.',
  'bring your heart; the story will do the rest.',
  'one ticket, one story, a memory to keep.',
  'let the performance find its way to you.',
  'your presence makes this moment complete.',
  'make room for a little drama and a lot of heart.',
  'every great story needs an audience like you.',
  'the next scene is better with you here.',
  'step into a story that stays with you.',
  'your place in this story is reserved.',
  'the evening is better with you in it.',
  'this admission opens the door to something special.',
];

export function getTicketWelcomeMessage(ticket) {
  const firstName = String(ticket.fullName || 'Guest').trim().split(/\s+/)[0] || 'Guest';
  const ticketSequence = String(ticket.ticketId || '').match(/(\d+)$/);
  const index = ticketSequence
    ? ((Number(ticketSequence[1]) - 1) % messageLines.length + messageLines.length) % messageLines.length
    : [...String(ticket.token || ticket.id || firstName)].reduce((hash, character) => ((hash * 31) + character.charCodeAt(0)) >>> 0, 7) % messageLines.length;

  return `${firstName}, ${messageLines[index]}`;
}
