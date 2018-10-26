<template>
<div class="columns" id="app" v-shortkey="['ctrl', 'alt', 'o']" @shortkey.native="handleShortCut()">
  <div class="column is-one-half">
    <section class="section">
      <h1 class="title">Ophtho Meds Generator (OMG)</h1>
      <p class="subtitle">
        Too lazy to write out ophtho medication instructions in all their tedious glory? Well you're in luck! Use the below form to generate the instructions and then copy-paste into your discharges. <b>Keyboard shortcuts for meds are in parentheses (e.g. (1) - press "1") or hit Ctrl-C to copy what you've got! Hit the Escape key to cancel and go "back".</b>
      </p>
            <a class="button" 
              style="display: none;"
              v-shortkey="{ 
                '1': ['1'],
                '2': ['2'],
                '3': ['3'],
                '4': ['4'],
                '5': ['5'],
                '6': ['6'],
                '7': ['7'],
                '8': ['8'],
                '9': ['9'],
                '0': ['0'],
                'esc': ['esc'],
                'enter': ['enter']
              }" 
              @shortkey="handleShortCut" 
             >Test</a>
      <hr>

      <!-- Medication Class Selector -->
      <section>
        <label class="label">Pick the class of medication</label>
        <div class="field is-grouped">
          <p class="control">
            <a class="button" :class="{'is-success': activeClassBtn == 'antibiotic'}" @click="selectClass('antibiotic')">
            <span class="icon">
              <i class="fas fa-bug"></i>
            </span>
            <span v-if="state==='chooseClass'">
              (1) Antibiotics (w/wo steroids)
            </span>
            <span v-else>
              Antibiotics (w/wo steroids)
            </span>
          </a>
          </p>
          <p class="control">
            <a class="button" @click="selectClass('antiinflammatory')" :class="{'is-success': activeClassBtn == 'antiinflammatory'}">
              <span class="icon">
                <i class="fas fa-fire"></i>
              </span>
            <span v-if="state==='chooseClass'">
              (2) Anti-Inflammatories
            </span>
            <span v-else>
              Anti-Inflammatories
            </span>
              <span>
              </span>
            </a>
          </p>
          <p class="control">
            <a class="button" @click="selectClass('glaucoma')" :class="{'is-success': activeClassBtn == 'glaucoma'}">
              <span class="icon">
                <i class="fas fa-arrow-alt-circle-down"></i>
              </span>
            <span v-if="state==='chooseClass'">
              (3) Glaucoma Meds
            </span>
            <span v-else>
              Glaucoma Meds
            </span>
            </a>
          </p>
        </div>
        <div class="field is-grouped">
          <p class="control">
            <a class="button" @click="selectClass('kcs')" :class="{'is-success': activeClassBtn == 'kcs'}">
              <span class="icon">
                <i class="fas fa-tint"></i>
              </span>
              <span v-if="state==='chooseClass'">
                (4) KCS Meds/Lubricants
              </span>
              <span v-else>
                KCS Meds/Lubricants
              </span>
            </a>
          </p>
          <p class="control">
            <a class="button" @click="selectClass('oral')" :class="{'is-success': activeClassBtn == 'oral'}">
              <span class="icon">
                <i class="fas fa-tablets"></i>
              </span>
              <span v-if="state==='chooseClass'">
                (5) Oral Meds
              </span>
              <span v-else>
                Oral Meds
              </span>
            </a>
          </p>
          <p class="control">
            <a class="button" @click="selectClass('misc')" :class="{'is-success': activeClassBtn == 'misc'}">
              <span class="icon">
                <i class="fas fa-band-aid"></i>
              </span>
              <span v-if="state==='chooseClass'">
                (6) Misc stuff (serum, dilators, miotics)
              </span>
              <span v-else>
                Misc stuff (serum, dilators, miotics)
              </span>
            </a>
          </p>
        </div>
      </section>

      <!-- Medication Selector -->
      <transition name="fade">
      <section v-show="state == 'chooseDrug' || state == 'chooseEye' || state =='chooseFreq' || state == 'ready'">
        <hr>
        <div v-if="drugClass == 'antibiotic'">
          <label class="label">Select an Antibiotic</label>
          <div class="buttons">
            <span 
              class="button" 
              v-for="(drug, index) in antibiotics" 
              :key=index
              @click="selectDrug(index)" 
              :class="{'is-success' : activeDrugBtn == index}"
            >
            <!-- eslint-disable-next-line  -->
            {{(index+1<10 && state=="chooseDrug") ? '(' + (index+1) + ')' : '' }} {{drug.drugName}}
            </span>
          </div>
        </div>
        <div v-show="drugClass == 'antiinflammatory'">
          <label class="label">Select an Anti-inflammatory</label>
          <div class="buttons">
            <span 
              class="button" 
              v-for="(drug, index) in antiinflammatories" 
              :key=index
              @click="selectDrug(index)" 
              :class="{'is-success' : activeDrugBtn == index}"
            >
            <!-- eslint-disable-next-line  -->
            {{(index+1<10 && state=="chooseDrug") ? '(' + (index+1) + ')' : '' }} {{drug.drugName}}
            </span>
          </div>
        </div>
      </section>
      </transition>

      <!-- Treated Eye Selector -->
      <transition name="fade">
      <section v-show="state == 'chooseEye' || state =='chooseFreq' || state == 'ready'">
        <hr>
        <div> 
          <label class="label">Select the Treated Eye(s)</label>
          <b-field>
            <b-radio-button v-model="sigEye" native-value="OS" type="is-success" @input="selectEye">
              <span v-if="state == 'chooseEye'">(1) OS</span>
              <span v-else>OS</span>
            </b-radio-button>

            <b-radio-button v-model="sigEye" native-value="OD" type="is-success" @input="selectEye">
              <span v-if="state == 'chooseEye'">(2) OD</span>
              <span v-else>OD</span>
            </b-radio-button>

            <b-radio-button v-model="sigEye" native-value="OU" type="is-success" @input="selectEye">
              <span v-if="state == 'chooseEye'">(3) OU</span>
              <span v-else>OU</span>
            </b-radio-button>
          </b-field>
        </div>
      </section>
      </transition>

      <!-- Frequency Selector -->
      <transition name="fade">
      <section v-show="state =='chooseFreq' || state == 'ready'">
        <hr>
        <label class="label">Select the desired frequency</label>
        <b-field>
          <b-radio-button v-model="sigFrequency" native-value="q24h" type="is-success" @input="selectFreq">
            <span v-if="state=='chooseFreq'">(1) q24h</span>
            <span v-else>q24h</span>
          </b-radio-button>

          <b-radio-button v-model="sigFrequency" native-value="BID" type="is-success" @input="selectFreq">
            <span v-if="state=='chooseFreq'">(2) BID </span>
            <span v-else>BID</span>
          </b-radio-button>

          <b-radio-button v-model="sigFrequency" native-value="TID" type="is-success" @input="selectFreq">
            <span v-if="state=='chooseFreq'">(3) TID</span>
            <span v-else>TID</span>
          </b-radio-button>

          <b-radio-button v-model="sigFrequency" native-value="QID" type="is-success" @input="selectFreq">
            <span v-if="state=='chooseFreq'">(4) QID</span>
            <span v-else>QID</span>
          </b-radio-button>

          <b-radio-button v-model="sigFrequency" native-value="q4h" type="is-success" @input="selectFreq">
            <span v-if="state=='chooseFreq'">(5) q4h</span>
            <span v-else>q4h</span>
          </b-radio-button>

          <b-radio-button v-model="sigFrequency" native-value="q2h" type="is-success" @input="selectFreq">
            <span v-if="state=='chooseFreq'">(6) q2h</span>
            <span v-else>q2h</span>
          </b-radio-button>

        </b-field>
        <div class="notification is-warning">
          Need to do different frequencies of the same drug for different eyes? Sorry. You'll have to change that manually (after you paste). <strong>Don't Forget!</strong>
        </div>

      </section>
      </transition>

      <hr>
      <transition>
      <a v-show="state=='ready'" class="button is-success" @click="addDrug()">(Enter) Add {{this.drug.drugName}} {{this.sigEye}} {{this.sigFrequency}}</a>
      </transition>

    </section>
  </div>

  <div class="column">
    <section class="section">
      <div class="block">
        <label class="label">E-collar/Cone</label>
        <b-radio v-model="ecollar" native-value="">
          Not needed (no text added)
        </b-radio>
        <b-radio v-model="ecollar" native-value="alltimes">
          At all times
        </b-radio>
        <b-radio v-model="ecollar" native-value="prn">
          When unmonitored or if pawing
        </b-radio>
      </div>
      <nav class="level">
        <div class="level-right">
          <p class="level-item">
            <a class="button" 
              v-shortkey="['ctrl', 'c']" 
              @shortkey="doCopy()" 
              @click="doCopy()"
            > Copy to Clipboard (Ctrl-C)</a>
          </p>
        </div>
      </nav>
      <textarea class="textarea" v-model="instructions" placeholder="Medication instructions here." rows="15" readonly></textarea>
      <div class="box">
        Drug Class: {{drugClass}}<br> Drug Name: {{this.drug.drugName}}<br> Sig: {{sigEye}} {{sigFrequency}}<br>State: {{state}}<br>e-collar: {{ecollar}}
        <ul>
          <li v-for="(item, key) in drugList" :key=key>
            <strong> {{ item }}</strong>
          </li>
        </ul>

      </div>
    </section>
  </div>
</div>
</template>

<script>

import drugs from "../assets/Drugs.json"

export default {
  data: function() {
    return {
      state: "chooseClass", // chooseClass, chooseDrug, chooseEye, chooseFreq, ready
      drugClass: "antibiotic",
      activeClassBtn: "",
      activeDrugBtn: null,
      ecollar: "", // null (no cone), all (at all times), wean (unmonitored or if pawing noted)
      drug: {},
      sigEye: "",
      sigFrequency: "",
      drugList: [],
      antibiotics: drugs.Antibiotics,
      antiinflammatories: drugs.Antiinflammatories
    }
  },
  methods: {
    selectClass: function(drugclass) {
      this.drugClass = drugclass;
      this.activeClassBtn = drugclass;
      this.state = "chooseDrug";
    },
    selectDrug: function(index) {
      switch(this.drugClass) {
        case 'antibiotics':
          this.drug = this.antibiotics[index];
          break;
        case 'antiinflammatory':
          this.drug = this.antiinflammatories[index];
          break;
      }
      this.activeDrugBtn = index;
      this.state = "chooseEye";
    },
    selectEye: function() {
      // this.sigEye = eye;
      this.state = "chooseFreq";
      // console.log("hi");
    },
    selectFreq: function () {
      this.state="ready";
    },
    addDrug: function() {
      this.drugList.push({
        drug: this.drug,
        eye: this.sigEye,
        frequency: this.sigFrequency
      });
      this.drug = {};
      this.drugClass = "";
      this.sigEye = "";
      this.sigFrequency = "";
      this.activeClassBtn = "";
      this.activeDrugBtn = null;
      this.state = "chooseClass";
    },
    handleShortCut(event) {
      switch (event.srcKey) {
        case 'enter':
          if(this.state == "ready")
            this.addDrug()
          break;
        case 'esc':
          switch(this.state) {
            case 'chooseClass':
            case 'chooseDrug':
              this.drugClass = "";
              this.activeClassBtn = "";
              this.state = "chooseClass";
              break;
            case 'chooseEye':
              this.drug = {};
              this.activeDrugBtn = null;
              this.state = "chooseDrug";
              break;
            case 'chooseFreq':
              this.state = "chooseEye";
              break;
            case 'ready':
              this.state = "chooseFreq";
              break;
          }
          break;
        case '1':
          switch(this.state) {
            case 'chooseClass':
              this.selectClass('antibiotic')
              break;
            case 'chooseDrug':
              this.selectDrug(0)
              break;
            case 'chooseEye':
              this.sigEye = "OS";
              this.selectEye();
              break;
            case 'chooseFreq':
              this.sigFrequency = "q24h"
              this.selectFreq();
              break;
            case 'ready':
              break;
          }
          break
        case '2':
          switch(this.state) {
            case 'chooseClass':
              this.selectClass('antiinflammatory')
              break;
            case 'chooseDrug':
              this.selectDrug(1)
              break;
            case 'chooseEye':
              this.sigEye = "OD";
              this.selectEye();
              break;
            case 'chooseFreq':
              this.sigFrequency = "BID"
              this.selectFreq();
              break;
            case 'ready':
              break;
          }
          break
        case '3':
          switch(this.state) {
            case 'chooseClass':
              this.selectClass('glaucoma')
              break;
            case 'chooseDrug':
              this.selectDrug(2)
              break;
            case 'chooseEye':
              this.sigEye = "OU";
              this.selectEye();
              break;
            case 'chooseFreq':
              this.sigFrequency = "TID"
              this.selectFreq();
              break;
            case 'ready':
              break;
          }
          break
        case '4':
          switch(this.state) {
            case 'chooseClass':
              this.selectClass('kcs')
              break;
            case 'chooseDrug':
              this.selectDrug(3)
              break;
            case 'chooseEye':
              break;
            case 'chooseFreq':
              this.sigFrequency = "QID"
              this.selectFreq();
              break;
            case 'ready':
              break;
          }
          break
        case '5':
          switch(this.state) {
            case 'chooseClass':
              this.selectClass('oral')
              break;
            case 'chooseDrug':
              this.selectDrug(4)
              break;
            case 'chooseEye':
              break;
            case 'chooseFreq':
              this.sigFrequency = "q4h"
              this.selectFreq();
              break;
            case 'ready':
              break;
          }
          break
        case '6':
          switch(this.state) {
            case 'chooseClass':
              this.selectClass('misc')
              break;
            case 'chooseDrug':
              this.selectDrug(5)
              break;
            case 'chooseEye':
              break;
            case 'chooseFreq':
              this.sigFrequency = "q2h"
              this.selectFreq();
              break;
            case 'ready':
              break;
          }
          break
        case '7':
          switch(this.state) {
            // case 'chooseClass':
            //   this.selectClass('misc')
            //   break;
            case 'chooseDrug':
              this.selectDrug(6)
              break;
            case 'chooseEye':
              break;
            case 'chooseFreq':
              break;
            case 'ready':
              break;
          }
          break
        case '8':
          switch(this.state) {
            // case 'chooseClass':
            //   this.selectClass('misc')
            //   break;
            case 'chooseDrug':
              this.selectDrug(7)
              break;
            case 'chooseEye':
              break;
            case 'chooseFreq':
              break;
            case 'ready':
              break;
          }
          break
        case '9':
          switch(this.state) {
            // case 'chooseClass':
            //   this.selectClass('misc')
            //   break;
            case 'chooseDrug':
              this.selectDrug(8)
              break;
            case 'chooseEye':
              break;
            case 'chooseFreq':
              break;
            case 'ready':
              break;
          }
          break
      }
      this.$toast.open('KB Test!' + event.srcKey)
    },
    doCopy: function () {
      this.$copyText(this.instructions).then( //function () {
        this.$toast.open('Copied Instructions to Clipboard!'));
    }
  },
  computed: {
    instructions: function() {
      let medicationInstructions = "";
      let numTopical = 0;

      for (let i = 0; i < this.drugList.length; i++) {
        let drugInstruction = "";

        if (this.drugList.length > 1) {
          drugInstruction += (i + 1).toString() + ". ";
        }

        if (this.drugList[i].drug.route == "topical") numTopical++;

        drugInstruction +=
          this.drugList[i].drug.drugName +
          " " +
          this.drugList[i].drug.formulation +
          " - Please apply " +
          this.drugList[i].drug.dose +
          " to " +
          toEnglish(this.drugList[i].eye) +
          " " +
          toEnglish(this.drugList[i].frequency) +
          ".  " +
          this.drugList[i].drug.clientInfo +
          "\n\n";
        medicationInstructions += drugInstruction;
      }

      if (numTopical > 1) {
        medicationInstructions +=
          "** If giving more than one topical medication in the same eye at the same time, please wait at least 5-10 minutes between each medication to allow for proper distribution and absorption; give any ointments or gels (thicker medications) LAST **\n\n";
      }

      if (this.ecollar === "alltimes") {
        medicationInstructions +=
          "** Please ensure that the cone (e-collar) is worn at ALL times, (even with eating, drinking, sleeping) in order to protect the eyes from self-trauma.**\n\n";
      } else if (this.ecollar === "prn") {
        medicationInstructions +=
          "** Please ensure that the cone (e-collar) is worn when unsupervised or if you note your pet pawing or rubbing at the eye(s) (e.g. after medications).**\n\n";
      }
      return medicationInstructions;
    }
  }

}

function toEnglish(term) {
  let english = "";
  switch (term) {
    case "OD":
      english = "the RIGHT eye";
      break;
    case "OS":
      english = "the LEFT eye";
      break;
    case "OU":
      english = "BOTH eyes";
      break;
    case "q24h":
      english = "once daily";
      break;
    case "BID":
      english = "twice daily (approximately every 12 hours)";
      break;
    case "TID":
      english = "three times daily (approximately every 8 hours)";
      break;
    case "QID":
      english = "four times daily (approximately every 6 hours)";
      break;
    case "q4h":
      english = "six times daily (approximately every 4 hours)";
      break;
    case "q2h":
      english = "every 2 hours";
      break;
  }
  return english;
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
  text-align: left;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

/* h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
} */
</style>
