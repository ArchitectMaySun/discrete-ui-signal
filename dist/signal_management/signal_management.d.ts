import SignalBus from "./signal_bus";
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
    trigger_context_changed: () => void;
}
export interface SignalData {
    [prop: string | number]: any;
}
export declare class SignalManagement {
    signal_contexts: SignalContexts;
    signal_bus_instance: SignalBus;
    signal_groups: SignalGroup[];
    context_changed_event_id: number;
    constructor();
    _regist_context_change(handler: Function): void;
    _context_changed(signal_name: string): void;
    detect_context_change(signal_names?: string[], group_logic?: (group_contexts: SignalContexts) => void): {
        signal_names: string[];
        group_logic: (group_contexts: SignalContexts) => void;
    };
    remove_signal_group(signal_group: SignalGroup): void;
    remove_context_changed_event(): void;
    regist_signal_processor(signal_name: string, processor: Function): void;
    clear_signal_processors(signal_name: string): void;
    send_signal(signal_name: string, ...args: any[]): void;
}
