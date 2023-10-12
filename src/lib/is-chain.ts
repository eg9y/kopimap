export function isChain(name: string) {
  const chains = [
    "starbucks",
    "maxx",
    "djournal",
    "kopikenangan",
    "kopi kenangan",
    "janji jiwa",
    "fore",
    "tanamera",
    "anomali",
    "kopi kulo",
    "point coffee",
    "j. co donuts & coffee",
  ];

  return chains.some((chain) => name.toLowerCase().includes(chain));
}
