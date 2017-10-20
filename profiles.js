module.exports = [
  {
    name: 'GPRS',
    bandwidth: 50,
    rtt: 500
  },
  {
    name: 'Regular 2G',
    bandwidth: 250,
    rtt: 300
  },
  {
    name: 'Good 2G',
    bandwidth: 450,
    rtt: 150
  },
  {
    name: 'Regular 3G',
    bandwidth: 750,
    rtt: 100
  },
  {
    name: 'Good 3G',
    bandwidth: 1000,
    rtt: 40
  },
  {
    name: 'Regular 4G',
    bandwidth: 4000,
    rtt: 20
  },

  // Based on Ofcom's research into the bandwidth and latency of 4G and 3G
  // networks in the UK in 2015
  // (see http://stakeholders.ofcom.org.uk/market-data-research/other/telecoms-research/broadband-speeds/mobile-bb-april-15/).
  //
  // Currently, µDL doesn't support configuring download and upload bandwidth.
  // As it's more likely that the user is downloading via µDL, use the download
  // bandwidth.
  {
    name: '4G (UK)',
    bandwidth: 14.7,
    // bandwidth: {
    //   download: 14.7,
    //   upload: 13.6
    //},
    rtt: 53.1
  },
  {
    name: '3G (UK)',
    bandwidth: 5.9,
    // bandwidth: {
    //   download: 5.9,
    //   upload: 1.6
    //},
    rtt: 63.5
  }
]
