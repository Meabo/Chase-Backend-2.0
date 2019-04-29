export default class Skill {
  name: string;
  duration: number;
  cooldown: number;
  faction: string; // Assassin - Defense or Illusionist
  type: number; // 0 normal, 1 is Ultimate
  readyTime: number[];

  isReady(skillIndex: number) {
    return this.readyTime[skillIndex] <= Date.now();
  }
}

/* List of skills available by Factions:  
- Basic: Catch / Steal

- Assassin: 

- Defense:

- Illusionnist:






*/
