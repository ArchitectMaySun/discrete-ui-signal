export const SEARCH_READY = `SEARCH_READY`;
export const TABLE_READY = `TABLE_READY`;
export const ALL_IS_READY = `ALL_IS_READY`;

import SignalManagement from "../../src/index.js";
import {
  SignalContext,
  SignalContexts,
  SignalProcessor,
} from "../../src/models/signal_management.js";

export function create_signal_manager() {
  const sm = new SignalManagement();

  function check_ready_in_context(context: SignalContext, is_ready: boolean) {
    if (!context.data) {
      context.data = {};
    }

    const old_value = context.data.is_ready;
    const new_value = is_ready;
    context.data.is_ready = new_value;

    if (old_value !== new_value) {
      context.notice();
    }
  }

  // $ regist signal's context change event
  const signal_names = [SEARCH_READY, TABLE_READY];

  const group_of_2_ready_signal = sm.monitor_multiple(
    signal_names,
    (contexts_of_signals: SignalContexts) => {
      // $ check contexts of every signal;
      if (
        signal_names.every((signal_name) => {
          const context = contexts_of_signals[signal_name].data;

          if (context) {
            return context.is_ready === true;
          } else {
            return false;
          }
        })
      ) {
        // + all is ready;

        // - sent [all is ready] signal
        sm.send_signal(ALL_IS_READY);
      }
    }
  );

  // $ regist senders' processor
  sm.monitor_one(SEARCH_READY, (context, is_ready) => {
    check_ready_in_context(context, is_ready);
  });
  sm.monitor_one(TABLE_READY, (context, is_ready) => {
    check_ready_in_context(context, is_ready);
  });

  function regist_all_ready_processor(handler: SignalProcessor) {
    sm.monitor_one(ALL_IS_READY, handler);
  }

  function signal_search_ready() {
    sm.send_signal(SEARCH_READY, true);
  }

  function signal_table_ready() {
    sm.send_signal(TABLE_READY, true);
  }

  function destroy() {
    sm.unmonitor_one(SEARCH_READY);
    sm.unmonitor_one(TABLE_READY);
    sm.unmonitor_one(ALL_IS_READY);
    sm.unmonitor_group(group_of_2_ready_signal);
    sm.remove_context_changed_event();
  }

  return {
    regist_all_ready_processor,
    destroy,
    signal_search_ready,
    signal_table_ready,
  };
}
