<template>
  <header class="channelArea width-control">
    <div class="tags" v-if="categorieHidden?false:true">
      <el-dropdown trigger="click" @command="dropdownEvent">
        <span class="el-dropdown-link">
          {{dropdownValue}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown" v-if="categories.length>0">
          <el-dropdown-item v-for="(item,index) in categories" :command="item" :key="index">{{item.name}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <nav class="channelList">
      <router-link to="/latest-all">最新</router-link>
      <router-link to="/popular-all">最热</router-link>
      <router-link to="/pending" v-if="viewerCanReview">等待审核</router-link>
    </nav>
  </header>

</template>

<script type="text/ecmascript-6">
  import {mapState} from 'vuex';

  export default {
    name: 'channel',
    data() {
      return {
        dropdownValue: '分类',
        activeName:[],
        viewerCanReview : true,
      }
    },
    props: {
      categorieHidden:Boolean,
    },
    methods: {
      dropdownEvent(category) {
        if (category.slug == 'all') {
          this.dropdownValue = `分类`;
        }
        else {
          this.dropdownValue = `分类：${category.name}`;
        }
        this.$emit('tagEvent', category);
      },
    },
    computed: {
      ...mapState(['categories'])
    },
    components: {},
    created() {
    }
  }
</script>
