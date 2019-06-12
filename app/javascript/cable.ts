import * as ActionCable from "actioncable";

const CABLE = `/cable`;

export let cable: ActionCable.Cable = (ActionCable.createConsumer as any)(
  CABLE
);
