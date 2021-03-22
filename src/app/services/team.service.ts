import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Team } from '../interfaces/team';
import { map } from 'rxjs/operators';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
export const TeamsTableHeaders = ['name', 'country', 'players'];
@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private teamsDb: AngularFireList<Team>;
  constructor(private db: AngularFireDatabase) {
    this.teamsDb = this.db.list('/teams', (ref) => ref.orderByChild('name'));
  }

  getTeams(): Observable<Team[]> {
    return this.teamsDb.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((change) => ({
          $key: change.payload.key,
          ...change.payload.val(),
        }));
      })
    );
  }

  addTeam(team: Team) {
    return this.teamsDb.push(team);
  }

  deleteTeam(id: string) {
    this.db.list('/teams').remove(id);
  }

  editTeam(newTeamData) {
    const $key = newTeamData.$key;
    delete newTeamData.$key;
    this.db.list('/teams').update($key, newTeamData);
  }
}
