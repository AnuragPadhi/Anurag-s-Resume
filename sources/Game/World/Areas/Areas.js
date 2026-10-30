import { Game } from '../../Game.js'
import { LandingArea } from './LandingArea.js'
import { ProjectsArea } from './ProjectsArea.js'
import { LabArea } from './LabArea.js'
import { CareerArea } from './CareerArea.js'
import { SocialArea } from './SocialArea.js'
import { AchievementsArea } from './AchievementsArea.js'

export class Areas
{
    constructor()
    {
        this.game = Game.getInstance()

        // Only the areas that represent a portfolio section are kept
        //   landing      => Home / introduction
        //   career       => Experience
        //   projects     => Projects
        //   lab          => Education & certifications
        //   achievements => Achievements
        //   social       => Skills & contact
        const list = [
            [ 'achievements', AchievementsArea ],
            [ 'career', CareerArea ],
            [ 'lab', LabArea ],
            [ 'landing', LandingArea ],
            [ 'projects', ProjectsArea ],
            [ 'social', SocialArea ],
        ]

        const model = [...this.game.resources.areasModel.scene.children]

        for(const child of model)
        {
            for(const [ name, AreaClass ] of list)
            {
                if(child.name.startsWith(name))
                    this[name] = new AreaClass(child)
            }
        }

    }
}
