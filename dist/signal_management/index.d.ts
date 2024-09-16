import { GroupLogic, SignalContexts, SignalGroup, SignalProcessor } from "../models/signal_management.js";
import SignalBus from "./signal_bus.js";
export declare class SignalManagement {
    signal_contexts: SignalContexts;
    signal_bus: SignalBus;
    signal_groups: SignalGroup[];
    context_changed_handler_id: number;
    constructor();
    _regist_context_change(handler: Function): void;
    _context_changed(signal_name: string): void;
    monitor_one(signal_name: string, signal_processor: SignalProcessor): void;
    monitor_multiple(signal_names: string[] | undefined, group_logic: GroupLogic): SignalGroup;
    unmonitor_group(signal_group: SignalGroup): void;
    unmonitor_groups(): void;
    remove_context_changed_event(): void;
    unmonitor_one(signal_name: string): void;
    send_signal(signal_name: string, ...args: any[]): void;
}
