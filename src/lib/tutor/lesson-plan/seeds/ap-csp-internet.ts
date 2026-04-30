/**
 * AP CSP — Internet and Networks.
 *
 * IP, TCP/UDP, DNS, HTTP, packets, redundancy, fault tolerance.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_CSP_INTERNET: LessonPlan = {
  id: 'evelyn.ap.csp.internet.v1',
  title: 'How the Internet Works',
  curriculum: 'CollegeBoard',
  grade: '11',
  subject: 'cs',
  topic: 'ap-cs-principles',
  locale: 'en',
  los: [
    {
      id: 'apcsp.internet',
      description: 'Explain how IP addresses, packets, DNS, and protocols enable end-to-end communication, and how redundancy makes the system fault-tolerant.',
      standard: 'AP-CSP-4',
    },
  ],
  prerequisites: [],
  followUps: ['apcsp.cybersecurity'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Internet as packet switching with redundant paths.',
      script: 'When you send a message across the internet, it doesn\'t travel as one chunk. It\'s shredded into packets, each with the destination address, and each packet may take a DIFFERENT route to get there. The genius is the design: no central control, redundant paths, and graceful failure when something breaks.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-stack',
      kind: 'concept',
      goal: 'IP, TCP, DNS, HTTP, and the packet model.',
      keyIdeas: [
        'IP ADDRESS: a unique number identifying a device on the network. IPv4 looks like 192.168.1.1 (4 octets, 32 bits total). IPv6 is longer (128 bits) — needed because IPv4 addresses ran out.',
        'PACKETS: data is split into chunks. Each packet carries the source IP, destination IP, sequence number, and a payload. Packets are independent and may take different paths.',
        'TCP (Transmission Control Protocol): reliable delivery. Numbers each packet, retransmits lost ones, reorders out-of-sequence ones. Used for email, web, file transfer.',
        'UDP (User Datagram Protocol): fast, unreliable. No retransmission, no ordering. Used for video calls, gaming — losing a frame is better than waiting.',
        'DNS (Domain Name System): translates human names (www.example.com) to IP addresses (93.184.216.34). DNS itself runs on a hierarchical network of servers.',
        'HTTP / HTTPS: the protocol your browser uses to ask for web pages. HTTPS encrypts the connection.',
        'REDUNDANCY: multiple paths between any two points. If one router goes down, packets reroute. There\'s no single internet "center" to attack.',
        'FAULT TOLERANCE: the system keeps working even when parts fail. This is by design: the original ARPANET was built to survive partial outages.',
      ],
      vocabulary: [
        { term: 'protocol', definition: 'an agreed-upon set of rules for communication.' },
        { term: 'packet', definition: 'a small chunk of data sent across a network with addressing info.' },
        { term: 'redundancy', definition: 'duplicate paths or resources that allow continued operation when one fails.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-trace',
      kind: 'worked_example',
      problem: 'Trace what happens when you type "www.example.com" into a browser and press Enter.',
      steps: [
        'STEP 1: Browser asks DNS to translate "www.example.com" into an IP address. DNS returns something like 93.184.216.34.',
        'STEP 2: Browser opens a TCP connection to that IP on port 80 (HTTP) or 443 (HTTPS). TCP handshake confirms both sides are ready.',
        'STEP 3: Browser sends an HTTP request: "GET / HTTP/1.1, Host: www.example.com".',
        'STEP 4: Request is shredded into packets. Each packet hops through routers — possibly different paths — toward the server.',
        'STEP 5: Server reassembles the request, finds the page, sends it back as packets.',
        'STEP 6: Browser receives, reassembles via TCP, renders HTML/CSS/JS. Page appears.',
        'TAKEAWAY: every step uses a different protocol. Failure of any one packet triggers retransmit; failure of one ROUTE triggers reroute.',
      ],
      answer: 'DNS lookup → TCP connection → HTTP request → packet routing → reassembly → render.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Which protocol would you choose for a live video call: TCP or UDP? Explain in one sentence.',
      expectedAnswer: 'UDP because losing a frame is better than waiting for retransmission, which would freeze the video.',
      responseFormat: 'free',
      hints: [
        'TCP retransmits lost packets — but retransmission takes time.',
        'For real-time media, low latency beats perfect delivery.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-internet-physical',
      kind: 'misconception_check',
      question: 'Is "the cloud" a wireless system that floats in the air?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating "cloud" as literally wireless / atmospheric.',
          correctsTo: 'No — the cloud is just somebody else\'s computer in a data center, connected by physical cables (often undersea fiber-optic cables). "Cloud" is a marketing word for "remote server you don\'t maintain". Wireless only refers to the LAST hop from your device to a router. Most internet traffic flows through copper and fiber.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'IP addresses identify devices. Packets carry data. TCP is reliable, UDP is fast.',
        'DNS translates names to IPs. HTTP/HTTPS is the web request protocol.',
        'Redundancy = multiple paths. Fault tolerance = system survives failures.',
        'No central authority — that\'s the design strength.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why did we have to invent IPv6 even though IPv4 still works for most addresses?',
      hint: 'IPv4 has 2^32 ≈ 4.3 billion addresses. With every phone, laptop, IoT device claiming one, we ran out. IPv6 has 2^128 — enough for every grain of sand on Earth to have its own address. NAT (network address translation) bought time, but the long-term fix is IPv6.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
