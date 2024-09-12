import { GroupLogic } from "../../src/signal_management/signal_management";
export declare function create_fields_motitor(): {
    monitor_related_fileds: (fields: string[] | undefined, group_logic: GroupLogic) => void;
    signal_field_changed: (field_name: string, field_value: any) => void;
    shape_field_context_when_target_field_changed: (field_name: string, context_shaper_fn: (field_value: any) => any) => void;
    destroy: () => void;
};
