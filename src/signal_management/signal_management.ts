import { GLOBAL_EVENT_CONTEXT_CHANGED } from "../constants/index";
import { SignalHanlder } from "../models/signal_bus";
import {
  GroupLogic,
  SignalContexts,
  SignalGroup,
  SignalProcessor,
} from "../models/signal_management";
import SignalBus from "./signal_bus";

export class SignalManagement {
  signal_contexts: SignalContexts;
  signal_bus: SignalBus;
  signal_groups: SignalGroup[];
  context_changed_handler_id: number;

  constructor() {
    // - every signal has its one own context to store state
    // - if target signal triggered, handler's first argument is this context
    this.signal_contexts = {};
    this.signal_bus = new SignalBus();

    // - one group is a collection of signals, one of those signals triggered will cause its group_logic
    this.signal_groups = [];
    this.context_changed_handler_id = -1; /// global event

    // $ regist a special event to process group event
    this._regist_context_change((signal_name: string) => {
      // + handler of `GLOBAL_EVENT_CONTEXT_CHANGED`

      // $ traversal groups
      for (const group of this.signal_groups) {
        const { signal_names, group_logic } = group;
        const group_context: SignalContexts = {};

        if (~signal_names.indexOf(signal_name)) {
          // + this group matched

          // $ collect every signals' contexts into this group context
          signal_names.forEach((signal_name) => {
            group_context[signal_name] = this.signal_contexts[signal_name];
          });

          // $ execute group logic with group's contexts
          group_logic(group_context);
        }
      }
    });
  }

  // # global event: `GLOBAL_EVENT_CONTEXT_CHANGED`
  _regist_context_change(handler: Function) {
    (handler as SignalHanlder).__is_onece = false;

    this.context_changed_handler_id = this.signal_bus.$on(
      GLOBAL_EVENT_CONTEXT_CHANGED,
      handler as SignalHanlder
    );
  }
  _context_changed(signal_name: string) {
    this.send_signal(GLOBAL_EVENT_CONTEXT_CHANGED, signal_name);
  }

  monitor_one(signal_name: string, signal_processor: SignalProcessor) {
    let signal_context = this.signal_contexts[signal_name];

    // $ initialize signal context;
    if (!signal_context) {
      signal_context = {
        data: null,
        handler_ids: [], /// ids for all registed processor
        notice_groups: () => {
          // - in signal handler, signal context contain `trigger_context_changed`
          // - this is used to trigger global event `GLOBAL_EVENT_CONTEXT_CHANGED`
          this._context_changed(signal_name);
        },
      };

      this.signal_contexts[signal_name] = signal_context;
    }

    // $ regist processor
    const new_handler_id = this.signal_bus.$on(
      signal_name,
      (...args: any[]) => {
        signal_processor(this.signal_contexts[signal_name], ...args);
      }
    );

    // $ add callback ids; for removing callbacks
    signal_context.handler_ids.push(new_handler_id);
  }
  /**
   * = regist a signal groups and specify its gorup handler;
   * @param signal_names
   * @param group_logic
   * @returns signal group for later deleting;
   */
  monitor_multiple(
    signal_names: string[] = [], // - collection of signal names
    group_logic: GroupLogic
  ): SignalGroup {
    let new_group = { signal_names, group_logic };
    this.signal_groups.push(new_group);

    return new_group;
  }

  /**
   * = remove single group by signal group object;
   * @param signal_group
   */
  unmonitor_group(signal_group: SignalGroup) {
    const index = this.signal_groups.indexOf(signal_group);

    if (~index) {
      this.signal_groups.splice(index, 1);
    }
  }
  unmonitor_groups() {
    this.signal_groups = [];
  }
  // = to disable context feature;
  remove_context_changed_event() {
    this.signal_groups = [];

    this.signal_bus.$off(
      GLOBAL_EVENT_CONTEXT_CHANGED,
      this.context_changed_handler_id
    );
  }

  unmonitor_one(signal_name: string) {
    const { handler_ids } = this.signal_contexts[signal_name];

    for (const handler_id of handler_ids) {
      this.signal_bus.$off(signal_name, handler_id);
    }

    delete this.signal_contexts[signal_name];
  }

  send_signal(signal_name: string, ...args: any[]) {
    this.signal_bus.$emit(signal_name, ...args);
  }
}
