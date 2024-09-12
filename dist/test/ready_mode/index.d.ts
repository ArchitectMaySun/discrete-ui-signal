export declare const SEARCH_READY = "SEARCH_READY";
export declare const TABLE_READY = "TABLE_READY";
export declare const ALL_IS_READY = "ALL_IS_READY";
import SignalManagement from "../../src/index.js";
import { SignalProcessor } from "../../src/signal_management/signal_management.js";
export declare function create_signal_manager(): {
    signal_manager: SignalManagement;
    regist_all_ready_processor: (callback: SignalProcessor) => void;
    destroy: () => void;
};
