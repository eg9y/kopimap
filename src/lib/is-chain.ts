export function isChain(name: string) {
  const chains = [
    "starbucks",
    "maxx",
    "djournal",
    "kopikenangan",
    "janji jiwa",
    "anomali",
  ];

  return chains.some((chain) => name.toLowerCase().includes(chain));
}
