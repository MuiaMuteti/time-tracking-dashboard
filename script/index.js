class UI {
    DAILY = "daily";
    WEEKLY = "weekly";
    MONTHLY = "monthly";

    constructor() {
        this.activitiesContainer = document.querySelector("section.activities");
        
        this.activitiesArray = [];

        this.activePeriod = this.DAILY;

        document.getElementById("daily").classList.add("active-period");

        this.firstLoad();
    }

    firstLoad() {
        this.loadData().
        then(activities => {
            this.activitiesArray = activities;
            this.generateCards();
            this.setEventListeners();
        }).
        catch(error => console.log(error));
    }

    setEventListeners() {
        document.querySelector(".period-selector").
            addEventListener("click", event => {
                switch (event.target.id) {
                    case this.DAILY:
                        this.handlePeriodChange(event.target, this.DAILY);
                        break;
                    case this.WEEKLY:
                        this.handlePeriodChange(event.target, this.WEEKLY);
                        break;
                    case this.MONTHLY:
                        this.handlePeriodChange(event.target, this.MONTHLY);
                        break;
                    default:
                        break;
                }
            });
    }

    handlePeriodChange(elem, newActivePeriod) {
        if (newActivePeriod === this.activePeriod) {
            return;
        }

        this.activePeriod = newActivePeriod;

        document.querySelectorAll(".period-selector .period-btn").
            forEach(btn => btn.classList.remove("active-period"));

        elem.classList.add("active-period");

        this.generateCards();
    }

    generateCards() {
        while(this.activitiesContainer.firstChild) {
            this.activitiesContainer.firstChild.remove();
        }

        this.activitiesArray.forEach(activity => {
            const title = activity.title;
            const activeTimeFrame = activity.timeframes[this.activePeriod];

            const card = this.getCard(
                {
                    title: title, 
                    currentHrs: activeTimeFrame.current, 
                    prevHrs: activeTimeFrame.previous,
                    prevPeriodLabel: this.getPreviousTimeFrameLabel(this.activePeriod)
                }
            );

            this.activitiesContainer.insertAdjacentHTML("beforeend", card);
        });
    }

    getCard({title, currentHrs, prevHrs, prevPeriodLabel}) {
        return `<div class="card border-rad-15 fallback-hours-card ${this.getClassName(title)}">
        <div class="content border-rad-15">
          <div class="content-top">
            <p class="activity-title">${title}</p>
            <button class="more-btn">
              <img src="./images/icon-ellipsis.svg" alt="additional actions">
            </button>
          </div>
          <div class="content-body">
            <p class="current-hrs">${this.getHoursLabel(currentHrs)}</p>
            <p class="previous-period">${prevPeriodLabel} - ${this.getHoursLabel(prevHrs)}</p>
          </div>
        </div>
      </div>`;
    }

    // fills the activities array with objects if no error occurs
    async loadData() {
        const response = await fetch('../data.json');     
            
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    // returns class name for a particular card
    // follows this naming convention in js and css: title-hours-card
    getClassName(title) {
        return title.split(' ').map(str => str.toLowerCase()).join('-') + '-hours-card';
    }

    getHoursLabel(hours) {
        return `${hours}hr${hours !== 1 ? 's' : ''}`;
    }

    getPreviousTimeFrameLabel(currentTimeFrame) {
        switch (currentTimeFrame) {
            case this.DAILY:
                return 'Yesterday';
            case this.WEEKLY:
                return 'Last Week';
            case this.MONTHLY:
                return 'Last Month';
            default:
                return '';
        }
    }
}

const mUI = new UI();