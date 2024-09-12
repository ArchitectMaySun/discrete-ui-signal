export type GroupLogic = (group_contexts: SignalContexts) => void;

export interface SignalGroup {
  signal_names: string[]; // - all signal names of this group
  group_logic: GroupLogic;
}
export interface SignalContexts {
  [signal_name: string]: SignalContext; // - one signal has one context obejct;
}
export interface SignalContext {
  data: SignalData | null;
  handler_ids: number[];
  notice_groups: () => void; // - notice context changed
}
export interface SignalData {
  [prop: string | number]: any;
}

export interface SignalProcessor {
  (signal_context: SignalContext, ...args: any[]): void;
}
