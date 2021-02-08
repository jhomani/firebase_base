class Stogare {
  private userId: string;

  constructor() {
    this.userId = '';
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  getUserId(): string {
    return this.userId;
  }
}

const storage = new Stogare();

export default storage;