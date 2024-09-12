export type GroupLogic = (group_contexts: SignalContexts) => void;
export interface SignalGroup {
    signal_names: string[];
    group_logic: GroupLogic;
}
export interface SignalContexts {
    [signal_name: string]: SignalContext;
}
export interface SignalContext {
    data: SignalData | null;
    handler_ids: number[];
    notice_groups: () => void;
}
export interface SignalData {
    [prop: string | number]: any;
}
export interface SignalProcessor {
    (signal_context: SignalContext, ...args: any[]): void;
}
