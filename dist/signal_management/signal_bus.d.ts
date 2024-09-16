import { SignalHanlder, SignalHolder } from "../models/signal_bus.js";
export default class SignalBus {
    signals_holder: SignalHolder;
    max_callback_id_existed: number;
    constructor();
    $on(name: string, callback: Function): number;
    $once(name: string, callback: SignalHanlder): number;
    $emit(name: string, ...args: any[]): void;
    $off(name: string, callback_id: number): void;
    _get_handler_container(name: string): import("../models/signal_bus.js").SignalContainer;
    _check_event_existence(name: string): void;
    _initial_new_event(name: string): void;
    _add_new_event_callback(name: string, callback: Function, is_once?: boolean): number;
}
