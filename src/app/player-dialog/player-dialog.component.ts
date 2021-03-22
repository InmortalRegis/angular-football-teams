import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Country } from '../globals/countries.enum';
import { SquadNumber } from '../globals/squad-number.enum';
import { TeamService } from '../services/team.service';
import { take } from 'rxjs/operators';
import { Team } from '../interfaces/team';
import { PlayerService } from '../services/player.service';
import { Player } from '../interfaces/player';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-player-dialog',
  templateUrl: './player-dialog.component.html',
  styleUrls: ['./player-dialog.component.scss'],
})
export class PlayerDialogComponent implements OnInit {
  @Input() player = {} as Player;
  @Output() onClose: EventEmitter<boolean> = new EventEmitter();
  public team = {} as Team;

  public countries = Object.keys(Country).map((key) => ({
    label: key,
    key: Country[key] as number,
  }));
  public squadNumber = Object.keys(SquadNumber)
    .splice(Object.keys(SquadNumber).length / 2)
    .map((key) => ({
      label: key,
      key: SquadNumber[key] as number,
    }));

  constructor(
    private teamService: TeamService,
    private playerService: PlayerService
  ) {
    this.teamService
      .getTeams()
      .pipe(take(1))
      .subscribe((teams) => {
        if (teams.length) {
          this.team = teams[0];
        }
      });
  }

  ngOnInit(): void {}

  newPlayer(playerFormValue) {
    const key = this.playerService.addPlayer(playerFormValue).key;
    const playerFormValueKey = {
      ...playerFormValue,
      key,
    };

    const formattedTeam = {
      ...this.team,
      players: [
        ...(this.team.players ? this.team.players : []),
        playerFormValueKey,
      ],
    };

    this.teamService.editTeam(formattedTeam);
  }

  private editPlayer(playerFormValue) {
    const playerFormValueWithKey = {
      ...playerFormValue,
      $key: this.player.$key,
    };
    const playerFormValueWithFormattedKey = {
      ...playerFormValue,
      key: this.player.$key,
    };
    delete playerFormValueWithFormattedKey.$key;
    const moddifiedPlayers = this.team.players
      ? this.team.players.map((player: any) => {
          return player.key === this.player.$key
            ? playerFormValueWithFormattedKey
            : player;
        })
      : this.team.players;
    const formattedTeam = {
      ...this.team,
      players: [
        ...(moddifiedPlayers
          ? moddifiedPlayers
          : [playerFormValueWithFormattedKey]),
      ],
    };
    this.playerService.editPlayer(playerFormValueWithKey);
    this.teamService.editTeam(formattedTeam);
  }

  onSubmit(playerForm: NgForm) {
    const playerFormValue: Player = { ...playerForm.value };
    if (playerForm.valid) {
      playerFormValue.leftFooted = !!playerFormValue.leftFooted;
    }
    if (this.player) {
      this.editPlayer(playerFormValue);
    } else {
      this.newPlayer(playerFormValue);
    }
    window.location.replace('#');
  }

  closeDialog() {
    this.onClose.emit(false);
  }
}
