import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Team } from '../interfaces/team';
import { TeamService, TeamsTableHeaders } from '../services/team.service';
import { take } from 'rxjs/operators';
import { Country } from '../globals/countries.enum';

@Component({
  selector: 'app-team-table',
  templateUrl: './team-table.component.html',
  styleUrls: ['./team-table.component.scss'],
})
export class TeamTableComponent implements OnInit {
  public teams$: Observable<Team[]>;
  public tableHeaders = TeamsTableHeaders;
  constructor(private teamService: TeamService) {}

  ngOnInit(): void {
    this.teams$ = this.teamService.getTeams();
    this.teamService
      .getTeams()
      .pipe(take(1))
      .subscribe((teams) => {
        if (!teams.length) {
          const team: Team = {
            name: 'My Amazing Team',
            country: Country.Colombia,
            players: null,
          };

          this.teamService.addTeam(team);
        }
      });
  }
}
