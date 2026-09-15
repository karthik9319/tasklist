export type View =
  | { type: "today" }
  | { type: "upcoming" }
  | { type: "inbox" }
  | { type: "list"; listId: string };
