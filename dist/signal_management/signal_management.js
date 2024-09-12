const GLOBAL_EVENT_CONTEXT_CHANGED = `GLOBAL_EVENT_CONTEXT_CHANGED`;
import SignalBus from "./signal_bus";
export class SignalManagement {
    constructor() {
        this.signal_contexts = {};
        this.signal_bus_instance = new SignalBus();
        this.signal_groups = [];
        this.context_changed_event_id = -1;
        this._regist_context_change((signal_name) => {
            for (const group of this.signal_groups) {
                const { signal_names, group_logic } = group;
                const group_context = {};
                if (~signal_names.indexOf(signal_name)) {
                    signal_names.forEach((signal_name) => {
                        group_context[signal_name] = this.signal_contexts[signal_name];
                    });
                    group_logic(group_context);
                }
            }
        });
    }
    _regist_context_change(handler) {
        handler.__is_onece = false;
        this.context_changed_event_id = this.signal_bus_instance.$on(GLOBAL_EVENT_CONTEXT_CHANGED, handler);
    }
    _context_changed(signal_name) {
        this.send_signal(GLOBAL_EVENT_CONTEXT_CHANGED, signal_name);
    }
    detect_context_change(signal_names = [], group_logic = (group_contexts) => { }) {
        let new_group = { signal_names, group_logic };
        this.signal_groups.push(new_group);
        return new_group;
    }
    remove_signal_group(signal_group) {
        const index = this.signal_groups.indexOf(signal_group);
        if (~index) {
            this.signal_groups.splice(index, 1);
        }
    }
    remove_context_changed_event() {
        this.signal_groups = [];
        this.signal_bus_instance.$off(GLOBAL_EVENT_CONTEXT_CHANGED, this.context_changed_event_id);
    }
    regist_signal_processor(signal_name, processor) {
        let signal_context = this.signal_contexts[signal_name];
        if (!signal_context) {
            signal_context = {
                data: null,
                handler_ids: [],
                trigger_context_changed: () => {
                    this._context_changed(signal_name);
                },
            };
            this.signal_contexts[signal_name] = signal_context;
        }
        const new_callback_id = this.signal_bus_instance.$on(signal_name, (...args) => {
            processor(this.signal_contexts[signal_name], ...args);
        });
        signal_context.handler_ids.push(new_callback_id);
    }
    clear_signal_processors(signal_name) {
        const { handler_ids } = this.signal_contexts[signal_name];
        for (const handler_id of handler_ids) {
            this.signal_bus_instance.$off(signal_name, handler_id);
        }
        delete this.signal_contexts[signal_name];
    }
    send_signal(signal_name, ...args) {
        this.signal_bus_instance.$emit(signal_name, ...args);
    }
}
//# sourceMappingURL=signal_management.js.map