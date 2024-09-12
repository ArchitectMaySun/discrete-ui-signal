export const SEARCH_READY = `SEARCH_READY`;
export const TABLE_READY = `TABLE_READY`;
export const ALL_IS_READY = `ALL_IS_READY`;
import SignalManagement from "../../src/index.js";
export function create_signal_manager() {
    const sm = new SignalManagement();
    const signal_names = [SEARCH_READY, TABLE_READY];
    sm.monitor_multiple(signal_names, (contexts_of_signals) => {
        if (signal_names.every((signal_name) => {
            const context = contexts_of_signals[signal_name].data;
            if (context) {
                return context.is_ready === true;
            }
            else {
                return false;
            }
        })) {
            sm.send_signal(ALL_IS_READY);
        }
    });
    sm.monitor_one(SEARCH_READY, (context, is_ready) => {
        if (!context.data) {
            context.data = {};
        }
        const old_value = context.data.is_ready;
        const new_value = is_ready;
        context.data.is_ready = new_value;
        if (old_value !== new_value) {
            context.notice();
        }
    });
    sm.monitor_one(TABLE_READY, (context, is_ready) => {
        if (!context.data) {
            context.data = {};
        }
        const old_value = context.data.is_ready;
        const new_value = is_ready;
        context.data.is_ready = new_value;
        if (old_value !== new_value) {
            context.notice();
        }
    });
    function regist_all_ready_processor(callback) {
        sm.monitor_one(ALL_IS_READY, callback);
    }
    function destroy() {
        sm.unmonitor_one(SEARCH_READY);
        sm.unmonitor_one(TABLE_READY);
        sm.unmonitor_one(ALL_IS_READY);
        sm.remove_context_changed_event();
    }
    return { signal_manager: sm, regist_all_ready_processor, destroy };
}
//# sourceMappingURL=index.js.map