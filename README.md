# Micro Device Lab

## What?

Micro Device Lab (µDL) is an application I made to help me quickly throttle the network connections of a number of mobile devices that're all connected to a Raspberry Pi wireless access point. The application runs on the Raspberry Pi, creating and deleting traffic control (TC) queuing disciplines and filters to manage round-trip time (RTT) and bandwidth for each device.

## Why?

I work with [the Reading Web née Mobile Web team](https://www.mediawiki.org/wiki/Reading/Web) at the [Wikimedia Foundation](https://wikimediafoundation.org) (WMF). The Reading deparment recently had an internal discussion about around how we might better understand users with low-end devices connected to low-bandwidth, unstable mobile networks, somewhat inspired by [Cade Metz's "Facebook Workers Ditch iPhones in Push for World Conquest"](http://www.wired.com/2015/10/facebook-workers-ditch-iphones-in-push-for-world-conquest/). During the discussion [**@dr0ptp4kt**](https://github.com/dr0ptp4kt) mentioned that at the WMF offices in San Francisco there's a wireless network that throttles the network connections of all connected devices to a 2G connection or thereabouts. I, however, nearly always work in London.

## How?

## Resources

I've referred to the following while piecing together µDL:

* [tc(8)](http://man7.org/linux/man-pages/man8/tc.8.html)
* [Linux Advanced Routing & Traffic Control HOWTO](http://lartc.org/howto/index.html)
* [netem](http://www.linuxfoundation.org/collaborate/workgroups/networking/netem)
* [tc Packet Filtering and netem](http://tcn.hypert.net/tcmanual.pdf), which was indispensible when I was fixing [#4: Existing filters aren't deleted](https://github.com/phuedx/micro-device-lab/issues/4)

## License

Micro Device Lab is [MIT-liscensed](./LICENSE).