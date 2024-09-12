- See examples in `test/` to learn how to use;

## Example

```javascript
import SignalManagement from "discrete-ui-signal";

import SignalManagement from "../../dist/index";

// # create signal management instance;
const sm = new SignalManagement();

// # regist handler for target signal;
sm.monitor_one("signal_a", (signal_context, ...args: any[]) => {
  const { data, notice_groups, handler_ids } = signal_context;

  // - check data, or compose data of this signal;
  if (data) {
    data.timestamp = new Date().getTime();
  }

  // - notice signal groups, those groups contain current signal("signal_a")
  // - will trigger gourp handler execution;
  notice_groups();
});

// # regist handler for target signals;
// - this registed handler will be called whenever any one of "signal_a", "signal_b" be sent
const group = sm.monitor_multiple(
  ["signal_a", "signal_b"],
  (group_contexts) => {
    const context_of_signal_a = group_contexts["signal_a"];
    const context_of_signal_b = group_contexts["signal_b"];

    // - check context_of_signal_a, context_of_signal_b
    // - execute logic related according to this context
  }
);

// # send signal, trigger handler execution;
const any_arguments = { descriptin: "any data transfered to handler" };
sm.send_signal("signal_a", any_arguments);

// # cleanning;
sm.unmonitor_group(group); // - cleanning one group;
sm.unmonitor_groups(); // - cleanning all groups;
sm.unmonitor_one("signal_a");
sm.unmonitor_one("signal_b");
```

[source code](https://github.com/ArchitectMaySun/discrete-ui-signal)
