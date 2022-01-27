<template>
  <div id="app2">
  <div v-if="loads==0" class="mask" @touchmove.prevent>&nbsp;</div>
  <b-container fluid="xs">
    <b-table-simple hover small caption-top responsive="xs">
      <b-thead head-variant="light">
        <b-tr>
          <b-th v-b-tooltip.hover :title="$t('message.title_chargerid')">{{'chargerid'|trans}}</b-th>
          <b-th v-b-tooltip.hover :title="$t('message.title_beeptime')">{{'beeptime'|trans}}</b-th>
          <b-th v-b-tooltip.hover :title="$t('message.title_rebootdate')">{{'rebootdate'|trans}}</b-th>
          <b-th v-b-tooltip.hover :title="$t('message.title_power')">{{'power'|trans}}</b-th>
          <b-th class="d-none d-md-table-cell" v-b-tooltip.hover :title="$t('message.title_boottimes')">{{'boottimes'|trans}}</b-th>
          <b-th class="d-none d-lg-table-cell" v-b-tooltip.hover :title="$t('message.title_location')">{{'location'|trans}}</b-th>
          <b-th class="d-none d-lg-table-cell" v-b-tooltip.hover :title="$t('message.title_temperature')">{{'temperature'|trans}}</b-th>
          <b-th class="d-none d-lg-table-cell" v-b-tooltip.hover :title="$t('message.title_ecurrent')">{{'ecurrent'|trans}}</b-th>
          <b-th class="d-none d-md-table-cell" v-b-tooltip.hover :title="$t('message.title_guestok')">{{'guestok'|trans}}</b-th>
          <b-th class="d-none d-md-table-cell" v-b-tooltip.hover :title="$t('message.title_gunstandard')">{{'gunstandard'|trans}}</b-th>
          <b-th class="d-none d-md-table-cell" v-b-tooltip.hover :title="$t('message.title_operate')">{{'operate'|trans}}</b-th>
        </b-tr>
      </b-thead>
      <b-tbody v-for="(item, index) in items" :key="index">
        <b-tr :class="item.connected==1?(item.stp==1?'bg-success text-warning':'bg-success text-white'):'bg-secondary text-light'">
          <b-td v-if="workingid==index">
              <b-input-group size="sm">
                <b-form-input v-model="item.chargerid"></b-form-input>
                <b-input-group-append>
                  <b-button variant="outline-warning" @click="setchargerid(item)">{{$t('message.btn_save')}}</b-button>
                </b-input-group-append>
              </b-input-group>
          </b-td>
          <b-td v-else-if="item.chargerid=='0'">0
          <b-icon icon="gear" @click="setme(index)" class="ml-3" size="lg" variant="warning"></b-icon>
          </b-td>
          <b-td v-else>
            <b-button variant="outline-warning" size="sm" :href="'/charger.html?id='+item.chargerid">{{item.chargerid}}</b-button>
          </b-td>
          <b-td v-b-tooltip.hover :title="item.mac">{{item.beeptime}}<span v-if="item.connected==1">({{item.keyid}})</span></b-td>
          <b-td v-b-tooltip.hover :title="item.rebootdate">{{item.onlinedate}}</b-td>
          <b-td>{{item.pwa[0]}}/{{item.pwa[1]}}</b-td>
          <b-td class="d-none d-md-table-cell" @click="docmd(4,item)">{{item.pon}}</b-td>
          <b-td class="d-none d-lg-table-cell">{{item.ipaddress}}</b-td>
          <b-td class="d-none d-lg-table-cell">{{item.tpa[0]}}/{{item.tpa[1]}}°C</b-td>
          <b-td v-if="imaxid==index">
              <b-input-group size="sm">
                <b-form-input v-model="item.imax[0]" v-if="item.gunstyle==2||item.gunstyle==3"></b-form-input>
                <b-form-input v-model="item.imax[1]" v-if="item.gunstyle==1||item.gunstyle==3"></b-form-input>
                <b-input-group-append>
                  <b-button variant="outline-warning" @click="setimax(item)">{{$t('message.btn_save')}}</b-button>
                </b-input-group-append>
              </b-input-group>
          </b-td>
          <b-td v-else @click="imaxme(index)" class="d-none d-lg-table-cell">{{item.ixa[0]}}/{{item.ixa[1]}}
          </b-td>
          <b-td class="d-none d-md-table-cell">{{GUEST_NOYES[item.guestok]|trans}}
          <b-icon icon="chevron-down" @click="openmodal(2,index)" variant="warning"></b-icon>
          </b-td>
          <b-td class="d-none d-md-table-cell">{{GUNSTANDARD[item.gunstandard]|trans}}
          <b-icon icon="chevron-down" @click="openmodal(0,index)" variant="warning"></b-icon>
          </b-td>
          <b-td class="d-none d-md-table-cell">
            <b-button-group size="sm">
                  <b-button variant="outline-warning" @click="docmd(1,item)" :disabled="item.connected==0">{{item.ver}}</b-button>
                  <b-button variant="outline-warning" @click="docmd(2,item)" :disabled="item.connected==0">{{$t('message.op_reboot')}}</b-button>
                  <b-button variant="outline-warning" @click="docmd(3,item)" :disabled="item.connected==0">{{$t('message.op_beep')}}</b-button>
            </b-button-group>
          </b-td>
      </b-tr>
      <b-tr>
        <b-td colspan="4" class="d-table-cell d-md-none">
          <span class="mr-1">
          {{item.pon}}
          </span>
          <template v-if="item.gunstyle==2">
            <span class="mr-1">{{item.tpa[0]}}</span>
            <span class="mr-1">{{item.ixa[0]}}</span>
          </template>
          <template v-else-if="item.gunstyle==1">
            <span class="mr-1">{{item.tpa[1]}}</span>
            <span class="mr-1">{{item.ixa[1]}}</span>
          </template>
          <template v-else>
            <span class="mr-1">{{item.tpa[0]}}/{{item.ixa[0]}}/{{item.ixa[1]}}</span>
          </template>
          <span class="mr-1">
          {{GUEST_NOYES[item.guestok]|trans}}
          <b-icon icon="chevron-down" @click="openmodal(2,index)" variant="warning"></b-icon>
          </span>
          <span class="mr-2">{{GUNSTANDARD[item.gunstandard]|trans}}
          <b-icon icon="chevron-down" @click="openmodal(0,index)" variant="warning"></b-icon>
          </span>
            <b-button-group size="sm">
                <b-button variant="outline-warning" @click="docmd(1,item)" :disabled="item.connected==0">{{item.ver}}</b-button>
                <b-button variant="outline-warning" @click="docmd(2,item)" :disabled="item.connected==0">{{$t('message.op_reboot')}}</b-button>
                <b-button variant="outline-warning" @click="docmd(3,item)" :disabled="item.connected==0">{{$t('message.op_beep')}}</b-button>
            </b-button-group>
        </b-td>
      </b-tr>
    </b-tbody>
  </b-table-simple>
  <div v-show="items.length==0" class="pl-4 pr-4">
    <b-card header-tag="header" footer-tag="footer" style="box-shadow: 10px 10px 20px rgba(51, 51, 51, .4);">
      <template v-slot:header>
        <h4 class="mb-0"><b-icon icon="lightning"></b-icon> {{$t('message.dev_empty_title')}}</h4>
      </template>
      <b-card-text>
        <p>
          <span v-html="$t('message.dev_empty_context')"></span>
         </p>
      </b-card-text>
    </b-card>
  </div>
  <b-form inline class="mt-2 ml-2">
    <b-input-group class="col-12">
        <b-button-group class="mr-auto">
          <b-button variant="outline-success" :disabled="nextPageToken==undefined">{{$t('message.btn_more')}}</b-button>
          <b-button variant="outline-success" href="/users.html">{{$t('message.btn_user')}}</b-button>
        </b-button-group>
        <b-navbar-nav class="mr-2">
        <b-nav-item @click="setLocale">{{'Change Language To: '|trans}}
          <b-avatar class="btn ml-2" size="sm" style="font-size:0.6em;" v-t.text="'message.languageto'" @click="setLocale"></b-avatar>
        </b-nav-item>
        </b-navbar-nav>
    </b-input-group>
  </b-form>
  <b-form inline class="mt-2 ml-2">
    <b-input-group class="col-12">
      <b-radio-group buttons class="mr-4" v-model="onoffsearch" button-variant="outline-primary" @change="onoffclick">
        <b-form-radio value="0">{{$t('message.onoffall')}}</b-form-radio>
        <b-form-radio value="1">{{$t('message.onlineonly')}}</b-form-radio>
        <b-form-radio value="2">{{$t('message.offlineonly')}}</b-form-radio>
      </b-radio-group>
      <b-form-input :placeholder="$t('message.searchhint')" v-model="search"></b-form-input>
      <b-input-group-append>
        <b-button variant="outline-primary" @click="dosearch">{{$t('message.btn_search')}}</b-button>
      </b-input-group-append>
    </b-input-group>
  </b-form>
  <b-form inline class="mt-2 ml-2 mb-4">
    <b-input-group class="col-12">
        <b-form-input :placeholder="$t('message.myuflaghint')" v-model="uflag"></b-form-input>
        <b-input-group-append>
          <b-button variant="info" @click="setuflag" :disabled="clicked">{{$t('message.btn_save')}}</b-button>
        </b-input-group-append>
    </b-input-group>
  </b-form>
  <b-modal v-model="modalshow" no-close-on-backdrop no-close-on-esc hide-header ok-only :ok-title="$t('message.btn_ok')">{{modalmsg}}</b-modal>
  <Selector v-bind="caller" @callback="callback" />
  </b-container>
  </div>
</template>
<script>
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
      loads:0,
      imaxid: -1,
      workingid:-1,
      workingme:-1,
      utype: 0,
      uflag: '',
      clicked:false,
      modalshow: false,
      modalmsg:'',
      search: '',
      onoffsearch:0,
      items: [],
      caller: {funid:0,index:0,datas:[]},
      nextPageToken:undefined,
      GUESTOKS: [this.$t('message.guest_no'),this.$t('message.guest_yes')],
      GUEST_NOYES: Guest_noyes,
      GUNSTANDARD: GunStandard
    }
  },
  methods: {
    async fetchData(){
      let evuserid = localStorage.getItem('evuserid');
      let qrystr = '/listchargers?tm='+new Date().getTime()+'&userid='+evuserid;
      if ( this.nextPageToken ) {
        qrystr = qrystr + '&nextToken=' + this.nextPageToken;
      }
      if ( this.search && this.search.length>0 ) {
        qrystr = qrystr + '&search=' + this.search;
      }
      if ( this.onoffsearch>0 )
      {
        qrystr = qrystr + '&connected=' + this.onoffsearch;
      }
      let result = await this.axios.get(qrystr);
      if (result.status==200) {
        this.loads++;
        if ( result.data.nextToken ) this.nextPageToken = result.data.nextToken;
        this.items.push.apply(this.items, result.data.items);
      }
    },
    async login(){
      let evuserid = localStorage.getItem('evuserid');
      let qryparam = '/login?userid='+evuserid+'&tm='+new Date().getTime();
      let loginresult = await this.axios.get(qryparam);
      this.utype = loginresult.data.utype;
      this.uflag = loginresult.data.uflag;
      if (loginresult.data.id)
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
    onoffclick($event){
      this.search = '';
      this.onoffsearch=Number($event);
      this.nextPageToken = undefined;
      this.items = [];
      this.fetchData();
    },
    dosearch() {
      if ( this.search.length>0 && this.search.length<4 ) {
        this.modalmsg = this.$t('message.err_search1');
        this.modalshow = true;
      } else if ( this.search.length > 12 ) {
        this.modalmsg = this.$t('message.err_search2');
        this.modalshow = true;
      } else if ( this.search.length > 6 && this.search.length < 11 && this.search.indexOf('-') == -1 ) {
        this.modalmsg = this.$t('message.err_search3');
        this.modalshow = true;
      } else {
        this.onoffsearch = 0;
        this.nextPageToken = undefined;
        this.items = [];
        this.fetchData();
      }
    },
    setme(idx) {
      this.workingid = idx;
    },
    imaxme(idx) {
      this.imaxid = idx;
    },
    async setimax(itm) {
      itm.imax[0] = Number(itm.imax[0]);
      itm.imax[1] = Number(itm.imax[1]);
      if (isNaN(itm.imax[0]) || isNaN(itm.imax[1])) {
        this.modalmsg = this.$t('message.err_imax');
        this.modalshow = true;
        return;
      }
      if (itm.imax[0]>32 || itm.imax[1]>32) {
        this.modalmsg = this.$t('message.err_maxi');
        this.modalshow = true;
        return;
      }
      this.imaxid = -1;
      let evuserid = localStorage.getItem('evuserid');
      let qryparam = '/setimax?userid='+evuserid+'&tm='+new Date().getTime()+'&mac='+itm.mac+'&imax='+itm.imax.join(',');
      await this.axios.get(qryparam);
      this.modalmsg = this.$t('message.set_ok');
      this.modalshow = true;
    },
    async setchargerid(itm) {
      this.workingid = -1;
      let evuserid = localStorage.getItem('evuserid');
      let qryparam = '/setchargerid?userid='+evuserid+'&tm='+new Date().getTime()+'&mac='+itm.mac+'&chargerid='+itm.chargerid;
      let ret = await this.axios.get(qryparam);
      if ( ret.rc < 0 ) {
        this.modalmsg = ret.tm;
        this.modalshow = true;
      }
    },
    async docmd(cmdid, itm) {
      if ( cmdid < 3 ) itm.connected = 0;
      let confimok = false;
      if (cmdid==1) {
          confimok = confirm(this.$t('message.otaconfirm'));
      } else {
          confimok = true;
      }
      if (confimok){
        let evuserid = localStorage.getItem('evuserid');
        let qryparam = '/docmd?userid='+evuserid+'&tm='+new Date().getTime()+'&cmd='+cmdid+'&mac='+itm.mac+'&ver='+itm.ver;
        let axresp = await this.axios.get(qryparam);
        if (cmdid==1 && axresp.data.rc<0) {
            this.modalmsg = axresp.data.rm;
            this.modalshow = true;
        }
      }
    },
    async setuflag() {
      if ( this.uflag.length>2 ) {
        this.clicked = true;
        let evuserid = localStorage.getItem('evuserid');
        let qryparam = '/setuserflag?userid='+evuserid+'&tm='+new Date().getTime()+'&uflag='+this.uflag;
        await this.axios.get(qryparam);
        this.modalmsg = this.$t('message.ok_uflag');
        this.modalshow = true;
      } else {
        this.modalmsg = this.$t('message.err_uflag');
        this.modalshow = true;
      }
    },
    setLocale() {
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
.mask {
    background-color: rgba(0,0,0,0.7);
    position:fixed;
    top:0;
    left:0;
    width:100%;
    height:100%;
    z-index:10;
}
</style>