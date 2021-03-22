import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Player } from '../interfaces/player';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private playersDb: AngularFireList<Player>;
  constructor(private db: AngularFireDatabase) {
    this.playersDb = this.db.list('/players', (ref) =>
      ref.orderByChild('name')
    );
  }

  getPlayers(): Observable<Player[]> {
    return this.playersDb.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((change) => ({
          $key: change.payload.key,
          ...change.payload.val(),
        }));
      })
    );
  }

  addPlayer(player: Player) {
    return this.playersDb.push(player);
  }

  deletePlayer(id: string) {
    this.db.list('/players/').remove(id);
  }

  editPlayer(newPlayerData) {
    const $key = newPlayerData.$key;
    delete newPlayerData.$key;
    this.db.list('/players').update($key, newPlayerData);
  }
}
