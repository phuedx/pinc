# Micro Device Lab

## What?

Micro Device Lab (µDL) is an application I made to help me quickly throttle the network connections of a number of mobile devices that're all connected to a Raspberry Pi wireless access point. The application runs on the Raspberry Pi, creating and deleting traffic control (TC) queuing disciplines and filters to manage round-trip time (RTT) and bandwidth for each device.

## Why?

I work with [the Reading Web née Mobile Web team](https://www.mediawiki.org/wiki/Reading/Web) at the [Wikimedia Foundation](https://wikimediafoundation.org) (WMF). The Reading deparment recently had an internal discussion about around how we might better understand users with low-end devices connected to low-bandwidth, unstable mobile networks, somewhat inspired by [Cade Metz's "Facebook Workers Ditch iPhones in Push for World Conquest"](http://www.wired.com/2015/10/facebook-workers-ditch-iphones-in-push-for-world-conquest/). During the discussion [**@dr0ptp4kt**](https://github.com/dr0ptp4kt) mentioned that at the WMF offices in San Francisco there's a wireless network that throttles the network connections of all connected devices to a 2G connection or thereabouts. I, however, nearly always work in London.

## How?

µDL works by assigning traffic from the device to one of a set of pre-defined "network throttling profiles". Each profile is a combination of two TC queuing disciplines (qdiscs): a [Token Bucket Filter qdisc](http://lartc.org/howto/lartc.qdisc.classless.html#AEN690) that limits the rate at which packets are sent; and a [netem qdisc](http://www.linuxfoundation.org/collaborate/workgroups/networking/netem) that delays each packet before it is sent.

> N.B. that the profiles are currently created immediately after installation (see [`script/setup`](./script/setup)) but there's [an ongoing conversation about how to fix that](https://github.com/phuedx/micro-device-lab/issues/2).

When a device has its network throttling profile changed, a [TC filter is created](http://lartc.org/howto/lartc.qdisc.filters.html) that matches packets from the device's IPv4 address and assigns them to a "flow" that corresponds to the profiles's first qdisc.

## Resources

I've referred to the following while piecing together µDL:

* [tc(8)](http://man7.org/linux/man-pages/man8/tc.8.html)
* [Linux Advanced Routing & Traffic Control HOWTO](http://lartc.org/howto/index.html)
* [netem](http://www.linuxfoundation.org/collaborate/workgroups/networking/netem)
* [tc Packet Filtering and netem](http://tcn.hypert.net/tcmanual.pdf), which was indispensible when I was fixing [#4: Existing filters aren't deleted](https://github.com/phuedx/micro-device-lab/issues/4)

## Feedback

Your thoughts and comments are, of course, always welcome. In descending order of responsiveness, you can:

* [PM me on IRC](https://webchat.freenode.net/),
* [create an issue on GitHub](https://github.com/phuedx/micro-device-lab/issues/new), or
* [tweet at me on Twitter](https://twitter.com/phuedx)

## License

Micro Device Lab is [MIT-licensed](./LICENSE).
