<template>
  <div id="app2">
  <b-container fluid="xs">
    <b-table-simple hover small caption-top responsive="xs" v-show="items.length">
      <b-thead head-variant="light">
        <b-tr>
          <b-th v-b-tooltip.hover :title="$t('message.title_chargerid')">{{'chargerid'|trans}}</b-th>
          <b-th v-b-tooltip.hover :title="$t('message.title_beeptime')">{{'beeptime'|trans}}</b-th>
          <b-th v-b-tooltip.hover :title="$t('message.title_rebootdate')">{{'rebootdate'|trans}}</b-th>
          <b-th class="d-none d-md-table-cell" v-b-tooltip.hover :title="$t('message.title_gunstandard')">{{'gunstandard'|trans}}</b-th>
          <b-th class="d-none d-md-table-cell" v-b-tooltip.hover :title="$t('message.title_chargertype')">{{'chargertype'|trans}}</b-th>
          <b-th class="d-none d-md-table-cell" v-b-tooltip.hover :title="$t('message.title_guestok')">{{'guestok'|trans}}</b-th>
          <b-th class="d-none d-md-table-cell" v-b-tooltip.hover :title="$t('message.title_boottimes')">{{'boottimes'|trans}}</b-th>
          <b-th class="d-none d-md-table-cell" v-b-tooltip.hover :title="$t('message.title_location')">{{'location'|trans}}</b-th>
          <b-th class="d-none d-md-table-cell" v-b-tooltip.hover :title="$t('message.title_ecurrent')">{{'ecurrent'|trans}}</b-th>
          <b-th class="d-none d-md-table-cell" v-b-tooltip.hover :title="$t('message.title_temperature')">{{'temperature'|trans}}</b-th>
          <b-th class="d-none d-md-table-cell" v-b-tooltip.hover :title="$t('message.title_power')">{{'power'|trans}}</b-th>
          <b-th class="d-none d-md-table-cell" v-b-tooltip.hover :title="$t('message.title_operate')">{{'operate'|trans}}</b-th>
        </b-tr>
      </b-thead>
      <b-tbody v-for="(item, index) in items" :key="index">
        <b-tr :class="item.connected==1?(item.stp==1?'bg-success text-warning':'bg-success text-white'):'bg-secondary text-light'">
          <b-td v-if="workingid==index">
              <b-input-group size="sm">
                <b-form-input v-model="item.chargerid"></b-form-input>
                <b-input-group-append>
                  <b-button variant="info" @click="setchargerid(item)">{{$t('message.btn_save')}}</b-button>
                </b-input-group-append>
              </b-input-group>
          </b-td>
          <b-td v-else-if="item.chargerid=='0'">0
          <b-icon icon="gear" @click="setme(index)" class="ml-3" size="lg" variant="warning"></b-icon>
          </b-td>
          <b-td v-else>
            <b-button size="sm" variant="outline-secondary" :href="'/charger.html?id='+item.chargerid">{{item.chargerid}}</b-button>
          </b-td>
          <b-td>{{item.beeptime}}</b-td>
          <b-td>{{item.actdate}}</b-td>
          <b-td class="d-none d-md-table-cell">{{GUNSTANDARD[item.gunstandard]|trans}}
          <b-icon icon="chevron-down" @click="openmodal(0,index)" variant="secondary"></b-icon>
          </b-td>
          <b-td class="d-none d-md-table-cell">{{CHARGERGUNS[item.chargertype]|trans}}
          <b-icon icon="chevron-down" @click="openmodal(1,index)" variant="secondary"></b-icon>
          </b-td>
          <b-td class="d-none d-md-table-cell">{{GUEST_NOYES[item.guestok]|trans}}
          <b-icon icon="chevron-down" @click="openmodal(2,index)" variant="secondary"></b-icon>
          </b-td>
          <b-td class="d-none d-md-table-cell">{{item.pon}}</b-td>
          <b-td class="d-none d-md-table-cell">{{item.location}}</b-td>
          <b-td class="d-none d-md-table-cell">{{item.ecurrent}}</b-td>
          <b-td class="d-none d-md-table-cell">{{item.tp0}}/{{item.tp2}}°C</b-td>
          <b-td class="d-none d-md-table-cell">{{item.pwa}}</b-td>
          <b-td class="d-none d-md-table-cell">
            <b-button-group size="sm">
                  <b-button :variant="item.connected==0?'outline-secondary':'outline-warning'" @click="docmd(1,item)" :disabled="item.connected==0">{{item.ver}}</b-button>
                  <b-button :variant="item.connected==0?'outline-secondary':'outline-warning'" @click="docmd(2,item)" :disabled="item.connected==0">{{$t('message.op_reboot')}}</b-button>
                  <b-button :variant="item.connected==0?'outline-secondary':'outline-warning'" @click="docmd(3,item)" :disabled="item.connected==0">{{$t('message.op_beep')}}</b-button>
            </b-button-group>
          </b-td>
      </b-tr>
      <b-tr>
        <b-td colspan="3" class="d-table-cell d-md-none">
          {{GUNSTANDARD[item.gunstandard]|trans}}
          <b-icon icon="chevron-down" @click="openmodal(0,index)" variant="secondary"></b-icon>
          {{CHARGERGUNS[item.chargertype]|trans}}
          <b-icon icon="chevron-down" @click="openmodal(1,index)" variant="secondary"></b-icon>
          {{GUEST_NOYES[item.guestok]|trans}}
          <b-icon icon="chevron-down" @click="openmodal(2,index)" variant="secondary"></b-icon>
          {{item.pon}}/{{item.pwa}}Kwh
        </b-td>
      </b-tr>
      <b-tr>
        <b-td colspan="3" class="d-table-cell d-md-none">
            {{item.ecurrent}}/
            {{item.tp0}}/{{item.tp2}}°C
              <b-button-group size="sm">
                    <b-button :variant="item.connected==0?'outline-secondary':'outline-warning'" @click="docmd(1,item)" :disabled="item.connected==0">{{item.ver}}</b-button>
                    <b-button :variant="item.connected==0?'outline-secondary':'outline-warning'" @click="docmd(2,item)" :disabled="item.connected==0">{{$t('message.op_reboot')}}</b-button>
                    <b-button :variant="item.connected==0?'outline-secondary':'outline-warning'" @click="docmd(3,item)" :disabled="item.connected==0">{{$t('message.op_beep')}}</b-button>
              </b-button-group>
        </b-td>
      </b-tr>
    </b-tbody>
  </b-table-simple>
  <b-form inline class="mt-2 ml-2">
    <b-button-group class="mr-auto">
      <b-button variant="success" disabled="disabled">{{$t('message.btn_more')}}</b-button>
    </b-button-group>
    <b-navbar-nav class="mr-2">
      <b-nav-item @click="setLocale">{{'Change Language To: '|trans}}
      <b-avatar class="btn ml-2" size="2em" v-t.text="'message.languageto'" @click="setLocale"></b-avatar>
      </b-nav-item>
    </b-navbar-nav>
  </b-form>
  <b-form inline class="mt-2 mb-4">
    <b-input-group class="ml-auto col-12">
        <b-form-input :placeholder="$t('message.myuflaghint')" v-model="uflag"></b-form-input>
        <b-input-group-append>
          <b-button variant="info" @click="setuflag">{{$t('message.btn_save')}}</b-button>
        </b-input-group-append>
    </b-input-group>
  </b-form>
  <Selector v-bind="caller" @callback="callback" />
  </b-container>
  </div>
</template>

<script>
import { shadowkeydesc } from '@/config'
import { ChargerGuns } from '@/config'
import { GunStandard } from '@/config'
import { Guest_noyes } from '@/config'
import Selector from '@/Selector.vue'
export default {
  name: 'devices',
  components: {
    Selector
  },
  mounted() {
    this.login();
    this.fetchData();
  },
  data() {
    return {
      workingid:-1,
      workingme:-1,
      utype: 0,
      uflag: '',
      search: '',
      connected: 0,
      items: [],
      caller: {funid:0,index:0,datas:[]},
      nextPageToken:undefined,
      GUESTOKS: [this.$t('message.guest_no'),this.$t('message.guest_yes')],
      GUEST_NOYES: Guest_noyes,
      CHARGERGUNS: ChargerGuns,
      GUNSTANDARD: GunStandard,
      SHADOWKEYDESC: shadowkeydesc
    }
  },
  methods: {
    dosearch() {
      this.nextPageToken = undefined;
      this.items = [];
      this.fetchData();
    },
    async fetchData(){
      let evuserid = localStorage.getItem('evuserid');
      let qrystr = '/listchargers?tm='+new Date().getTime()+'&userid='+evuserid;
      if ( this.nextPageToken ) {
        qrystr = qrystr + '&nextToken=' + this.nextPageToken;
      }
      if ( this.search && this.search.legth>0 ) {
        qrystr = qrystr + '&search=' + this.search;
      }
      if ( this.connected>0 )
      {
        qrystr = qrystr + '&connected=' + this.connected;
      }
      let result = await this.axios.get(qrystr);
      if ( result.data.nextToken ) this.nextPageToken = result.data.nextToken;
      this.items.push.apply(this.items, result.data.items);
    },
    async login(){
      let evuserid = localStorage.getItem('evuserid');
      let qryparam = '/login?userid='+evuserid+'&tm='+new Date().getTime();
      let loginresult = await this.axios.get(qryparam);
      this.utype = loginresult.data.utype;
      this.uflag = loginresult.data.uflag;
      if (evuserid==undefined || evuserid.length!=21)
      {
        localStorage.setItem('evuserid', loginresult.data.id);
      }
    },
    async setmyuserid(){
      let qryparam = '/setmyuserid?tm='+new Date().getTime();
      let loginresult = await this.axios.get(qryparam);
      if (loginresult==undefined && loginresult.data && loginresult.data.userid && loginresult.data.userid.length==21)
      {
        localStorage.setItem('evuserid', loginresult.data.userid);
      }
    },
    openmodal(funid,idx) {
      this.workingme = idx;
      let item = this.items[idx];
      this.caller.funid = funid;
      if (funid==0) {
        this.caller.index = item.gunstandard;
        this.caller.datas = [this.$t('message.US'),this.$t('message.EU'),this.$t('message.GB')];
      } else if (funid==1){
        this.caller.index = item.chargertype;
        this.caller.datas = [this.$t('message.long_ct_0'),this.$t('message.long_ct_1'),this.$t('message.long_ct_2'),this.$t('message.long_ct_3')];
      } else {
        this.caller.index = item.guestok;
        this.caller.datas = [this.$t('message.guest_no'),this.$t('message.guest_yes')];
      }
      console.log(this.caller.datas);
      this.$bvModal.show('mdSelector0');
    },
    async callback(obj) {
      let item = this.items[this.workingme];
      if ( obj.funid == 0 ) {
        item.gunstandard = obj.index;
        let evuserid = localStorage.getItem('evuserid');
        let qryparam = '/setgunstandard?userid='+evuserid+'&tm='+new Date().getTime()+'&mac='+item.mac+'&gunstandard='+obj.index;
        this.workingme = -1;
        await this.axios.get(qryparam);
        this.items = [];
        this.fetchData();
      } else if ( obj.funid == 1 ){
        item.chargertype = obj.index;
        let evuserid = localStorage.getItem('evuserid');
        let qryparam = '/setchargertype?userid='+evuserid+'&tm='+new Date().getTime()+'&mac='+item.mac+'&chargertype='+obj.index;
        this.workingme = -1;
        await this.axios.get(qryparam);
        this.items = [];
        this.fetchData();
      } else {
        item.guestok = obj.index;
        let evuserid = localStorage.getItem('evuserid');
        let qryparam = '/setguestok?userid='+evuserid+'&tm='+new Date().getTime()+'&mac='+item.mac+'&guestok='+obj.index;
        this.workingme = -1;
        await this.axios.get(qryparam);
        this.items = [];
        this.fetchData();
      }
    },
    async setme(idx) {
      this.workingid = idx;
    },
    async setchargerid(itm) {
      this.workingid = -1;
      let evuserid = localStorage.getItem('evuserid');
      let qryparam = '/setchargerid?userid='+evuserid+'&tm='+new Date().getTime()+'&mac='+itm.mac+'&chargerid='+itm.chargerid;
      let ret = await this.axios.get(qryparam);
      if ( ret.rc < 0 ) {
        alert(ret.rm);
      }
    },
    async docmd(cmdid, itm) {
      if ( cmdid < 2 ) itm.connected = 0;
      let evuserid = localStorage.getItem('evuserid');
      let qryparam = '/docmd?userid='+evuserid+'&tm='+new Date().getTime()+'&cmd='+cmdid+'&mac='+itm.mac;
      await this.axios.get(qryparam);
    },
    async setuflag() {
      if ( this.uflag.length>0 ) {
        let evuserid = localStorage.getItem('evuserid');
        let qryparam = '/setuserflag?userid='+evuserid+'&tm='+new Date().getTime()+'&uflag='+this.uflag;
        await this.axios.get(qryparam);
      }
    },
    setLocale() {
      console.log(this.$i18n.locale);
      if (this.$i18n.locale=='EN') {
        localStorage.setItem('locale', 'CN');
        this.$i18n.locale='CN';
      } else {
        localStorage.setItem('locale', 'EN');
        this.$i18n.locale='EN';
      }
    },
  }
}
</script>

<style>
#app2 {
}
</style>
