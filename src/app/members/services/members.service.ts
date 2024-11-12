import { Injectable } from '@angular/core';
import { BaseService } from "./base.service";
import { Member } from "../model/member.entity";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class MembersService extends BaseService<Member> {

  constructor(http: HttpClient) {
    super(http);
    this.resourceEndpoint = '/members'; // EndPoint correcto para miembros
  }
}
