import Pusher from "pusher-js";

export const pusher = new Pusher("afd7303e6040279c51fa", {
    cluster: 'ap1'
})

export const eventName = {
    'notifyQueued': 'App\\Events\\NotifyQueuedQueue',
    'notifyMachine': 'App\\Events\\NotifyOnWorkQueue',
    'notifyNextOrDoneQueue': 'App\\Events\\NotifyNextOrDoneQueue',
}   