class Stogare {
  private userId: string;

  constructor() {
    this.userId = '';
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  getUserId() {
    return this.userId;
  }
}

const storage = new Stogare();

export default storage;