<template>
    <div>
        <form autocomplete="off">
            <div class="mb-8">
                <h1 class="mb-3 text-90 font-normal text-2xl">
                    Clone/Duplicate from Group: {{group ? group.name : ''}}
                </h1>

                <div class="card">

                    <div class="flex border-b border-40">
                        <div class="w-1/5 px-8 py-6">
                            <label for="actionType">Action Type</label>
                        </div>
                        <div class="py-6 px-8 w-1/2">
                            <select id="actionType"
                                    class="w-full form-control form-select"
                                    v-model="actionType"
                            >
                                <option disabled value="">Please select one</option>
                                <option v-bind:value="CLONE_NEW">{{actionTypeName(CLONE_NEW)}}</option>
                                <option v-bind:value="CLONE_EXISTING">{{actionTypeName(CLONE_EXISTING)}}</option>
                                <option v-bind:value="DUPLICATE_NEW">{{actionTypeName(DUPLICATE_NEW)}}</option>
                                <option v-bind:value="DUPLICATE_EXISTING">{{actionTypeName(DUPLICATE_EXISTING)}}</option>
                            </select>
                        </div>
                    </div>

                    <div v-if="actionType">
                        <div v-if="requiresNewGroup">
                            <div class="flex border-b border-40">
                                <div class="w-1/5 px-8 py-6">
                                    <label for="newGroupName">
                                        New Group Name
                                    </label>
                                </div>
                                <div class="py-6 px-8 w-1/2">
                                    <input id="newGroupName" type="text" v-model="newGroupName"
                                           class="w-full form-control form-input form-input-bordered"/>
                                </div>
                            </div>
                        </div>

                        <div v-else>
                            <div class="flex border-b border-40">
                                <div class="w-1/5 px-8 py-6">
                                    <label for="existingGroupId">
                                        Existing Group
                                    </label>
                                </div>
                                <div class="py-6 px-8 w-1/2">
                                    <select id="existingGroupId"
                                            class="w-full form-control form-select"
                                            v-model="existingGroupId"
                                    >
                                        <option disabled value="">Please select one</option>
                                        <option v-for="group in otherGroups" v-bind:value="group.id">{{group.name}}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="readyForCardSelection">
                        <div class="flex border-b border-40">
                            <div class="w-1/5 px-8 py-6">
                                <label>
                                    Cards
                                </label>
                            </div>
                            <div class="py-6 px-8 mx-8 w-full">
                                <label class="label-select-all">
                                    <input type="checkbox"
                                           class="checkbox mt-2"
                                           v-model="selectAll"/>
                                    Select All
                                </label>
                                <div v-for="card in cards" v-bind:key="card.id">
                                    <label>
                                        <input type="checkbox"
                                               class="checkbox mt-2"
                                               v-model="selected"
                                               v-bind:value="card.id"/>
                                        {{card.title}}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex items-center">
                <button
                        v-on:click="cancel"
                        class="btn btn-link dim cursor-pointer text-80 ml-auto mr-6"
                >Cancel</button>
                <button
                        type="button"
                        v-bind:disabled="!canSubmit"
                        v-if="actionType"
                        v-on:click="submitClone"
                        class="btn btn-default btn-primary inline-flex items-center relative"
                >{{actionTypeName(this.actionType)}}</button>
            </div>
        </form>
    </div>
</template>

<script>
export default {
  data() {
    return {
      actionType: null,
      existingGroupId: null,
      groupId: null,
      group: null,
      newGroupName: null,
      selected: [],
    }
  },
  computed: {
    // Constants as computed properties (why doesn't vue just allow constants)
    CLONE_NEW: () => 'clone-new',
    CLONE_EXISTING: () => 'clone-existing',
    DUPLICATE_NEW: () => 'duplicate-new',
    DUPLICATE_EXISTING: () => 'duplicate-existing',

    canSubmit: function () {
      return this.readyForCardSelection && this.selected.length;
    },
    cards: function() {
      return this.group.cards;
    },
    otherGroups: function () {
      return this.group.otherGroups;
    },
    readyForCardSelection: function () {
      return this.actionType &&
        ((!this.requiresNewGroup && this.existingGroupId) || (this.requiresNewGroup && this.newGroupName));
    },
    requiresNewGroup: function () {
      return this.actionType === this.CLONE_NEW || this.actionType === this.DUPLICATE_NEW;
    },
    selectAll: {
      get: function () {
        return this.cards ? this.selected.length == this.cards.length : false;
      },
      set: function (value) {
        let selected = [];
        if (value) {
          this.cards.forEach(function (card) {
            selected.push(card.id);
          });
        }
        this.selected = selected;
      }
    },
  },
  mounted() {
    this.getGroup(this.$route.query.group);
  },
  methods: {
    actionTypeName(actionType) {
      switch(actionType) {
        case this.CLONE_EXISTING:
          return 'Clone Selected to Existing Group';
        case this.CLONE_NEW:
          return 'Clone Selected to New Group';
        case this.DUPLICATE_EXISTING:
          return 'Duplicate Selected to Existing Group';
        case this.DUPLICATE_NEW:
          return 'Duplicate Selected to New Group';
      }
    },
    cancel() {
      this.$router.push('/resources/groups/' + this.groupId);
    },
    getGroup(groupId) {
      if (groupId) {
        this.groupId = groupId;
        axios.get('/nova/groups/' + groupId).then(response => {
          this.group = response.data;
        });
      }
    },
    submitClone() {
      let postData = {
        actionType: this.actionType,
        existingGroupId: this.existingGroupId,
        newGroupName: this.newGroupName,
        cards: this.selected,
      };
      axios.post('/nova/groups/' + this.groupId + '/clone', postData)
          .then(function (response) {
            let targetGroupId = response.data.targetGroupId;
            this.$router.push('/resources/groups/' + targetGroupId);
          }.bind(this))
          .catch(function(error){
            let response = error.response;
            if (response.status === 422) {
              let errors = response.data.errors;
              let messages = [];
              Object.entries(errors).forEach(([key, val]) => {
                messages.push(val[0]); // the value of the current key.
              });
              window.alert(messages.join("\n"));
            } else {
              console.log(response);
            }
          });
    },
  },
}
</script>

<style>
/* Scoped Styles */
    .mt-2 {
        margin-top: 0.4rem;
        margin-bottom: .5rem;
    }
    .label-select-all {
        font-weight: bold;
    }
</style>
