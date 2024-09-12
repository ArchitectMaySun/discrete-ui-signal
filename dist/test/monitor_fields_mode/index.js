import SignalManagement from "../../src/index";
export function create_fields_motitor() {
    const sm = new SignalManagement();
    const signals_has_context_shaper = [];
    function monitor_related_fileds(fields = [], group_logic) {
        sm.monitor_multiple(fields, group_logic);
    }
    function signal_field_changed(field_name, field_value) {
        sm.send_signal(field_name, field_value);
    }
    function shape_field_context_when_target_field_changed(field_name, context_shaper_fn) {
        sm.monitor_one(field_name, (signal_context, field_value) => {
            signal_context.data = context_shaper_fn(field_value);
            signal_context.notice();
        });
        signals_has_context_shaper.push(field_name);
    }
    function destroy() {
        sm.unmonitor_groups();
        signals_has_context_shaper.forEach((signal_name) => {
            sm.unmonitor_one(signal_name);
        });
    }
    return {
        monitor_related_fileds,
        signal_field_changed,
        shape_field_context_when_target_field_changed,
        destroy,
    };
}
const { monitor_related_fileds, signal_field_changed, shape_field_context_when_target_field_changed, destroy, } = create_fields_motitor();
monitor_related_fileds(["field_name_a", "field_name_b", "field_name_c"], (group_contexts) => {
});
shape_field_context_when_target_field_changed("field_name_a", (field_value) => {
    return field_value;
});
signal_field_changed("field_name_a", "value");
destroy();
//# sourceMappingURL=index.js.map