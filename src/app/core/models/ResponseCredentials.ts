export class ApplicationData {
  name: string = "";
  url: string = "";
  photo: string = "";
}

export class ResponseCredentials {
  token: string = ""; 
  photo: string = ""; 
  expireTime: number = 0;
  apps : ApplicationData[] = [];
}
  