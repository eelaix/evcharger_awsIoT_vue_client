<template>
  <div id="app1">
  <div v-if="loads==0" class="mask" @touchmove.prevent>&nbsp;</div>
  <b-container fluid="xs">
    <b-form inline>
      <b-navbar-nav class="mr-2 ml-auto">
        <b-nav-item @click="setLocale">{{'Change Language To: '|trans}}
        <b-avatar class="btn ml-2" v-t.text="'message.languageto'" @click="setLocale"></b-avatar>
        </b-nav-item>
      </b-navbar-nav>
    </b-form>
    <div class="boxw devbox1">
        <div class="boxw devbox2" :class="chargerstaclass[charge.stateid]">
          <div class="boxhead mt-2 mb-4">
          <div class="pt-3" :class="requestclass">{{'chargerid'|trans}}: {{chargerid}}</div>
          <div class="pb-3">{{'chargerguns'|trans}}: {{CHARGERGUNS[charge.chargertype]|trans}}</div>
          </div>
          <b-row cols="2">
            <b-col class="rowpad1">
    <div>{{'state_charger'|trans}}: <br/><span class="text-info">{{charge.connected==1?$t('message.online'):$t('message.offline')}}</span></div>
    <div>{{'state_stop'|trans}}: <br/><span class="text-info">{{charge.stp==1?$t('message.stopdn'):$t('message.normal')}}</span></div>
    <div>{{'state_l_gnd'|trans}}: <br/><span class="text-info">{{charge.lgd==1?$t('message.normal'):$t('message.abnormal')}}</span></div>
    <div>{{'state_box'|trans}}: <br/><span class="text-info">{{charge.dor==1?$t('message.closed'):$t('message.opened')}}</span></div>
    <div>{{'charge_pnp'|trans}}: <br/><span class="text-info">{{charge.pnp==1?$t('message.forbid'):$t('message.allowed')}}</span></div>
    <div>{{'charge_guestok'|trans}}: <br/><span class="text-info">{{charge.guestok==1?$t('message.allowed'):$t('message.forbid')}}</span></div>
            </b-col>
            <b-col class="rowpad2">
    <div>{{'charge_fwmver'|trans}}: <br/><span class="text-primary">{{charge.ver}}</span></div>
    <div>{{'state_dev'|trans}}: <br/><span class="text-primary">{{CHARGERSTATS[charge.stateid]|trans}}</span></div>
    <div>{{'charge_current'|trans}}: <br/><span class="text-primary">{{charge.ixa}}A</span></div>
    <div>{{'charge_tempure'|trans}}: <br/><span class="text-primary">{{charge.tp0}}°C</span></div>
    <div>{{'charge_volplus'|trans}}: <br/><span class="text-primary">{{charge.cpa}}V</span></div>
    <div>{{'charge_volmin'|trans}}: <br/><span class="text-primary">{{charge.cza}}V</span></div>
            </b-col>
          </b-row>
          <b-row cols="3" class="ml-5 mr-5 mb-3">
            <b-col>
              <b-button @click="setgun(0)" block :variant="gunid==0?'primary':'outline-primary'" v-if="charge.chargertype>1">
              {{'gunleft'|trans}}
              </b-button>
              <span v-else>&nbsp;</span>
            </b-col>
            <b-col>
              <b-button @click="setgun(1)" block :disabled="charge.imax[1]==0" :variant="gunid==1?'primary':'outline-primary'" v-if="charge.chargertype>1">
              {{'gunmid'|trans}}
              </b-button>
              <span v-else>&nbsp;</span>
            </b-col>
            <b-col>
              <b-button @click="setgun(2)" block :disabled="charge.imax[2]==0" :variant="gunid==2?'primary':'outline-primary'" v-if="charge.chargertype>1">
              {{'gunright'|trans}}
              </b-button>
              <span v-else>&nbsp;</span>
            </b-col>
          </b-row>
          <b-button @click="docharge()" block size="lg" :variant="charge.stateid<2?'success':'secondary'" class="pt-4 pb-4" style="font-size:2.5em;">
            {{'startcharge'|trans}}
          </b-button>
        </div>
      </div>
      <b-input-group class="ml-auto mt-4 col-10 col-md-6 col-lg-3 col-xl-3">
          <b-form-input :placeholder="$t('message.myuflaghint')" v-model="uflag"></b-form-input>
          <b-input-group-append>
            <b-button variant="info" @click="setuflag" :disabled="clicked">{{$t('message.btn_save')}}</b-button>
          </b-input-group-append>
      </b-input-group>
  </b-container>
  </div>
</template>
<script>
const getQueryString = function ( name ) {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)")
  let r = window.location.search.substr(1).match(reg)
  if (r != null) return decodeURI(r[2])
  return null
}
import { ChargerGuns } from '@/config'
import { ChargerSTATS } from '@/config'
export default {
  name: 'charger',
  components: {
  },
  mounted() {
    this.login();
    this.fetchData();
  },
  data() {
    return {
      loads:0,
      mac: undefined,
      chargerid:getQueryString('id'),
      utype:0,
      uflag:'',
      clicked:false,
      requestclass:'text-danger',
      gunid:0,
      chargerstaclass:['st_readyfree','st_readygunin','st_readywaiting','st_readycharging','st_readybadgnd','st_stopdown','st_offline'],
      charge:{mac:'',guestok:1,chargertype:0,gunstandard:0,connected:0,ver:'0.0.0',pnp:0,stp:0,dor:0,lgd:0,st0:0,st1:0,st2:0,pw0:0,pw1:0,pw2:0,pw3:0,ix0:0,ix1:0,ix2:0,tp0:0,tp1:0,cp0:0,cp1:0,cp2:0,cz0:0,cz1:0,cz2:0,stateid:0,imax:[32,0,0]},
      CHARGERGUNS:ChargerGuns,
      CHARGERSTATS:ChargerSTATS
    }
  },
  methods: {
    async fetchData(){
      this.requestclass = 'text-danger';
      let evuserid = localStorage.getItem('evuserid');
      let qrystr = '/getcharger?tm='+new Date().getTime()+'&userid='+evuserid+'&gunid='+this.gunid+'&loads='+this.loads;
      if ( this.mac ) {
        qrystr = qrystr + '&mac=' + this.mac;
      } else {
        qrystr = qrystr + '&chargerid=' + this.chargerid;
      }
      let result;
      try{
        result = await this.axios.get(qrystr);
      }catch(e){
        console.error(e);
      }
      if (result && result.status==200) {
        this.loads++;
        this.charge = result.data;
        this.mac = this.charge.mac;
        this.requestclass = 'text-muted';
        if ( this.loads < 1000 ) {
            setTimeout(this.fetchData, 1000);
        }
      }
    },
    async login(){
      let evuserid = localStorage.getItem('evuserid');
      let loginparam = '/login?userid='+evuserid+'&tm='+new Date().getTime();
      let loginresult = await this.axios.get(loginparam);
      if (loginresult.data.utype==-1) {
          alert('请点击“在浏览器中打开”并添加书签，不要直接用微信操作');
      } else {
        this.utype = loginresult.data.utype;
        this.uflag = loginresult.data.uflag;
        if (evuserid==undefined || evuserid.length!=21)
        {
            localStorage.setItem('evuserid', loginresult.data.id);
        }
      }
    },
    async setmyuserid(){
      let loginparam = '/setmyuserid?tm='+new Date().getTime();
      let loginresult = await this.axios.get(loginparam);
      if (loginresult==undefined && loginresult.data && loginresult.data.userid && loginresult.data.userid.length==21)
      {
        localStorage.setItem('evuserid', loginresult.data.userid);
      }
    },
    async setgun(id){
      this.gunid = id;
      this.fetchData();
    },
    async docharge(){
      if (this.charge.stateid<2) {
        this.charge.stateid = 2;
        let evuserid = localStorage.getItem('evuserid');
        let doparam = '/docharge?tm='+new Date().getTime()+'&userid='+evuserid+'&mac='+this.charge.mac+'&gunid='+this.gunid;
        await this.axios.get(doparam);
        this.fetchData();
      }
    },
    async setuflag() {
      if ( this.uflag.length>0 ) {
        this.clicked = true;
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
@media only screen and (orientation: portrait) {
  #app1 {
    line-height: 1.4em;
  }
  .boxw {
    width:100%;
    border-radius:100%;
  }
  .devbox2 {
    border: 1px dotted rgba(0,0,0,0.1);
  }
  .rowpad1 div {
    margin-left:34px;
    padding-left:20px;
    margin-bottom: 10px;
    border-radius:50%;
    width:90%;
    border-left:1px dotted rgba(0,0,0,0.2);
    border-bottom:1px dotted rgba(0,0,0,0.2);
    border-right:1px dotted rgba(0,0,0,0.2);
  }
  .rowpad2 div {
    padding-left:30px;
    margin-bottom: 10px;
    border-radius:50%;
    width:80%;
    border-left:1px dotted rgba(0,0,0,0.2);
    border-bottom:1px dotted rgba(0,0,0,0.2);
    border-right:1px dotted rgba(0,0,0,0.2);
  }
}
@media only screen and (orientation: landscape) {
  #app1 {
    line-height: 1.5em;
  }
  .boxw {
    width:600px;
    border-radius:100%;
  }
  .devbox2 {
    line-height: 1.8em;
    border: 1px dotted rgba(0,0,0,0.1);
  }
  .rowpad1 div {
    margin-left:100px;
    padding-left:40px;
    margin-bottom: 10px;
    border-radius:50%;
    border-left:1px dotted rgba(0,0,0,0.2);
    border-bottom:1px dotted rgba(0,0,0,0.2);
    border-right:1px dotted rgba(0,0,0,0.2);
  }
  .rowpad2 div {
    margin-left:0px;
    padding-left:40px;
    width:60%;
    margin-bottom: 10px;
    border-radius:50%;
    border-left:1px dotted rgba(0,0,0,0.2);
    border-bottom:1px dotted rgba(0,0,0,0.2);
    border-right:1px dotted rgba(0,0,0,0.2);
  }
}
.boxhead{
  margin:0 auto;
  width:50%;
  text-align: center;
  border-radius:50%;
  border-left:1px dotted rgba(255,0,0,0.2);
  border-bottom:1px dotted rgba(255,0,0,0.2);
  border-right:1px dotted rgba(255,0,0,0.2);
}
.devbox1 {
  margin:0 auto;
}
.st_readyfree {
  background-color:rgba(0,255,0,0.2);
}
.st_readygunin {
  background-color:rgba(0,255,128,0.1);
}
.st_readywaiting {
  background-color:rgba(255,255,0,0.2);
}
.st_readycharging {
  background-color:rgba(0,0,255,0.2);
}
.st_readybadgnd {
  background-color:rgba(255,128,255,0.2);
}
.st_stopdown {
  background-color:rgba(255,128,0,0.1);
}
.st_offline {
  background-color:rgba(255,0,0,0.2);
}
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