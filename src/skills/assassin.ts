import Skills from "./skills";

class AssassinSkills extends Skills {
  triggerCoolDown(skill: string) {
    switch (skill) {
      case "longhand": // skill index 0
        this.readyTime[0] = Date.now() + 30;
        break;
      case "silence": // skill index 1
        this.readyTime[1] = Date.now() + 45;
        break;
      case "nocturne": // skill index 2
        this.readyTime[2] = Date.now() + 60;
        break;
      case "assassin": // skill index 3 - Ultimate
        this.readyTime[3] = Date.now() + 120;
        break;
      case "room": // skill index 4 - Ultimate
        this.readyTime[4] = Date.now() + 180;
        break;
    }
  }
  //Long distance steal : Luffy gomu gomu no
  LongHand(id: string, actualRange: number, distance: number) {
    if (this.isReady(0)) {
      const range = actualRange + distance;
      this.triggerCoolDown("longhand");
      return range;
    }
  }

  Silence(id: string, defenseState: boolean, idGuardian: string) {
    //const guardian = getPlayer(idGuardian);
    if (this.isReady(1) && !defenseState) {
      this.triggerCoolDown("silence");
      return true;
    }
  }

  Nocturne(id: string, defenseState: boolean, idGuardian: string) {
    //const guardian = getPlayer(idGuardian);
    if (this.isReady(2) && !defenseState) {
      this.triggerCoolDown("nocturne");
      return true;
    }
  }

  Assassin(id: string, defenseStateUltimate: boolean, idGuardian: string) {
    //const guardian = getPlayer(idGuardian);
    if (this.isReady(3) && !defenseStateUltimate) {
      this.triggerCoolDown("assassin");
      return true;
    }
  }
}
