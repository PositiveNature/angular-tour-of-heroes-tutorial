import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss']
})

export class HeroesComponent implements OnInit {
  heroes: Hero[] = [];
  selectedHero?: Hero;

  constructor(
    private heroService: HeroService,
    private messageService: MessageService
  ) { }
  
  ngOnInit(): void {
    this.getHeroes();

    // select first element
    // this.selectedHero = this.heroes[0]
  }

  getHeroes(): void {
    this.heroService.getHeroes()
      .subscribe(heroes => this.heroes = heroes);
  }

  onSelect(hero: Hero): void {
    console.log(`clicked ${hero.name}`)
    console.log(this.selectedHero)
    if (this.selectedHero == hero) {
      this.selectedHero = undefined;
      this.messageService.add(`HeroesComponent: Deselected hero: id = ${hero.id}`)
    } else {
      this.selectedHero = hero;
      this.messageService.add(`HeroesComponent: Selected hero: id = ${hero.id}`)
    }
  }
}
