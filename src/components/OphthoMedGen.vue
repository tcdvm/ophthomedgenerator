<template>
<div class="columns" id="app" v-shortkey="['ctrl', 'alt', 'o']" @shortkey.native="keyboardtest()">
  <div class="column is-one-half">
    <section class="section">
      <h1 class="title">Ophtho Meds Generator (OMG)</h1>
      <p class="subtitle">
        Too lazy to write out ophtho medication instructions in all their tedious glory? Well you're in luck! Use the below form to generate the instructions and then copy-paste into your discharges.
      </p>
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
            <span>
              Antibiotics (w/wo steroids)
            </span>
          </a>
          </p>
          <p class="control">
            <a class="button" @click="selectClass('antiinflammatory')" :class="{'is-success': activeClassBtn == 'antiinflammatory'}">
              <span class="icon">
                <i class="fas fa-fire"></i>
              </span>
              <span>
                Anti-Inflammatories
              </span>
            </a>
          </p>
          <p class="control">
            <a class="button" @click="selectClass('glaucoma')" :class="{'is-success': activeClassBtn == 'glaucoma'}">
              <span class="icon">
                <i class="fas fa-arrow-alt-circle-down"></i>
              </span>
              <span>
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
              <span>
                KCS Meds/Lubricants
              </span>
            </a>
          </p>
          <p class="control">
            <a class="button" @click="selectClass('oral')" :class="{'is-success': activeClassBtn == 'oral'}">
              <span class="icon">
                <i class="fas fa-tablets"></i>
              </span>
              <span>
                Oral Meds
              </span>
            </a>
          </p>
          <p class="control">
            <a class="button" @click="selectClass('misc')" :class="{'is-success': activeClassBtn == 'misc'}">
              <span class="icon">
                <i class="fas fa-band-aid"></i>
              </span>
              <span>
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
        <div v-show="drugClass == 'antibiotic'">
          <label class="label">Select an Antibiotic</label>
          <div class="buttons">
            <span 
              class="button" 
              v-for="(drug, index) in antibiotics" 
              :key=index
              @click="selectDrug(drug, index)" 
              :class="{'is-success' : activeDrugBtn == index}"
            >
            {{drug.drugName}}
          </span>
          </div>
        </div>
      </section>
      </transition>

      <!-- Treated Eye Selector -->
      <transition name="fade">
      <section v-show="state == 'chooseEye' || state =='chooseFreq' || state == 'ready'">
        <hr>
        <div v-show="drugClass == 'antibiotic'">
          <label class="label">Select the Treated Eye(s)</label>
          <b-field>
            <b-radio-button v-model="sigEye" native-value="OS" type="is-success" @change="selectEye">
              <span>OS</span>
            </b-radio-button>

            <b-radio-button v-model="sigEye" native-value="OD" type="is-success" @change="selectEye">
              <span>OD</span>
            </b-radio-button>

            <b-radio-button v-model="sigEye" native-value="OU" type="is-success" @change="selectEye">
              <span>OU</span>
            </b-radio-button>
          </b-field>
        </div>
      </section>
      </transition>

      <!-- Frequency Selector -->
      <transition name="fade">
      <section v-show="sigEye">
        <hr>
        <label class="label">Select the desired frequency</label>
        <b-field>
          <b-radio-button v-model="sigFrequency" native-value="q24h" type="is-success">
            <span>q24h</span>
          </b-radio-button>

          <b-radio-button v-model="sigFrequency" native-value="BID" type="is-success">
            <span>BID</span>
          </b-radio-button>

          <b-radio-button v-model="sigFrequency" native-value="TID" type="is-success">
            <span>TID</span>
          </b-radio-button>

          <b-radio-button v-model="sigFrequency" native-value="QID" type="is-success">
            <span>QID</span>
          </b-radio-button>

          <b-radio-button v-model="sigFrequency" native-value="q4h" type="is-success">
            <span>q4h</span>
          </b-radio-button>

          <b-radio-button v-model="sigFrequency" native-value="q2h" type="is-success">
            <span>q2h</span>
          </b-radio-button>

        </b-field>
        <div class="notification is-warning">
          Need to do different frequencies of the same drug for different eyes? Sorry. You'll have to change that manually (after you paste). <strong>Don't Forget!</strong>
        </div>

      </section>
      </transition>

      <hr>
      <transition>
      <a v-show="sigFrequency" class="button is-success" @click="addDrug()">Add {{this.drug.drugName}} {{this.sigEye}} {{this.sigFrequency}}</a>
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
      antibiotics: [
        {
          drugName: "NeoPolyBac",
          formulation: "ophthalmic ointment",
          route: "topical",
          clientInfo: "This medication is a topical antibiotic.",
          dose: 'a small amount (e.g. 1/4" strip)'
        },
        {
          drugName: "NeoPolyGram",
          formulation: "ophthalmic solution",
          route: "topical",
          clientInfo: "This medication is a topical antibiotic.",
          dose: "1 drop"
        },
        {
          drugName: "NeoPolyDex Drops",
          formulation: "ophthalmic solution",
          route: "topical",
          clientInfo: "This medication is a topical antibiotic.",
          dose: "1 drop"
        },
        {
          drugName: "NeoPolyDex Ointment",
          formulation: "ophthalmic ointment",
          route: "topical",
          clientInfo: "This medication is a topical antibiotic.",
          dose: 'a small amount (e.g. 1/4" strip)'
        },
        {
          drugName: "Terramycin",
          formulation: "ophthalmic ointment",
          route: "topical",
          clientInfo: "This medication is a topical antibiotic.",
          dose: 'a small amount (e.g. 1/4" strip)'
        },
        {
          drugName: "Tobramycin",
          formulation: "ophthalmic solution",
          route: "topical",
          clientInfo: "This medication is a topical antibiotic.",
          dose: "1 drop",
        },
        {
          drugName: "Gentamicin",
          formulation: "ophthalmic solution",
          route: "topical",
          clientInfo: "This medication is a topical antibiotic.",
          dose: "1 drop",
        },
        {
          drugName: "Erythromicin",
          formulation: "ophthalmic ointment",
          route: "topical",
          clientInfo: "This medication is a topical antibiotic.",
          dose: 'a small amount (e.g. 1/4" strip)',
        },
        {
          drugName: "Chloramphenicol",
          formulation: "ophthalmic ointment",
          route: "topical",
          clientInfo: "This medication is a topical antibiotic.",
          dose: 'a small amount (e.g. 1/4" strip)',
        },
        {
          drugName: "Ciprofloxacin",
          formulation: "ophthalmic solution",
          route: "topical",
          clientInfo: "This medication is a topical antibiotic.",
          dose: "1 drop"
        }
      ]
    }
  },
  methods: {
    selectClass: function(drugclass) {
      this.drugClass = drugclass;
      this.activeClassBtn = drugclass;
      this.state = "chooseDrug";
    },
    selectDrug: function(drug, index) {
      this.drug = drug;
      this.activeDrugBtn = index;
      this.state = "chooseEye";
    },
    selectEye: function() {
      //      this.sigEye = eye;
      this.state = "chooseFreq";
      alert("hi");
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
    keyboardtest: function () {
      this.$toast.open('KB Test!')
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
