import SignalManagement from "../../src/index";
import { GroupLogic } from "../../src/models/signal_management";

export function create_fields_motitor() {
  const sm = new SignalManagement();
  const signals_has_context_shaper: string[] = [];

  function monitor_related_fileds(
    fields: string[] = [],
    group_logic: GroupLogic
  ) {
    sm.monitor_multiple(fields, group_logic);
  }

  function signal_field_changed(field_name: string, field_value: any) {
    sm.send_signal(field_name, field_value);
  }

  function shape_field_context_when_target_field_changed(
    field_name: string,
    context_shaper_fn: (field_value: any) => any
  ) {
    sm.monitor_one(field_name, (signal_context, field_value) => {
      signal_context.data = context_shaper_fn(field_value);
      signal_context.notice_groups();
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

const {
  monitor_related_fileds,
  signal_field_changed,
  shape_field_context_when_target_field_changed,
  destroy,
} = create_fields_motitor();

// # componnet a:
monitor_related_fileds(
  ["field_name_a", "field_name_b", "field_name_c"],
  (group_contexts) => {
    // - inspect group_contexts;
    // - do some logic;
  }
);

// # component b:
shape_field_context_when_target_field_changed("field_name_a", (field_value) => {
  return field_value;
});

// - in a event handler:
signal_field_changed("field_name_a", "value");

// # when leave component a and b:
destroy();
