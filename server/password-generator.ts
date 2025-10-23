const GIFT_PASSWORDS = [
  "wrap", "bows", "card", "joy!", "love", "give", "chrs", "gift", "prez",
  "neat", "cool", "yay!", "woo!", "wow!", "cute", "kiss", "hug!", "thks",
  "best", "time", "wish", "hope", "open", "peek", "tada", "yess", "win!",
  "glow", "star", "pink", "gold", "silk", "gems", "lace", "rose", "lily"
];

const usedPasswords = new Set<string>();

export function generateGiftPassword(): string {
  const available = GIFT_PASSWORDS.filter(pwd => !usedPasswords.has(pwd));
  
  if (available.length === 0) {
    usedPasswords.clear();
    return GIFT_PASSWORDS[Math.floor(Math.random() * GIFT_PASSWORDS.length)];
  }
  
  const password = available[Math.floor(Math.random() * available.length)];
  usedPasswords.add(password);
  return password;
}
