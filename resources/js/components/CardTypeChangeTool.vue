<template>
    <div>
        <form autocomplete="off">
            <div class="mb-8">
                <h1 class="mb-3 text-90 font-normal text-2xl">
                    Change Card Type
                </h1>

                <div class="card">
                        <div class="flex border-b border-40">
                            <div class="w-1/5 px-8 py-6">
                                <label for="actionType">Card Types</label>
                            </div>
                            <div class="py-6 px-8 w-1/2">
                                <select id="actionType"
                                        class="w-full form-control form-select"
                                        v-model="type"
                                >
                                    <option disabled value="">Please select one</option>
                                    <option v-for="type in cardTypes" v-bind:value="type.id">{{type.name}}</option>
                                </select>
                            </div>
                        </div>

                        <div v-if="readyForCardSelection">
                            <div class="flex border-b border-40">
                                <div class="w-1/5 px-8 py-6">
                                    <label>
                                        Card Types
                                    </label>
                                </div>
                                <div class="py-6 px-8 mx-8 w-full">
                                    <label class="label-select-all">
                                        <input type="checkbox"
                                               class="checkbox mt-2"
                                               v-model="selectAll"/>
                                        Select All
                                    </label>
                                    <div v-for="card in groupCards" v-bind:key="card.id">
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
                >Cancel
                </button>
                <button
                        type="button"
                        v-bind:disabled="!canSubmit"
                        v-if="type"
                        v-on:click="submitCards"
                        class="btn btn-default btn-primary inline-flex items-center relative"
                >Update Questions
                </button>
            </div>
        </form>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                groupCards: null,
                cardTypes: [],
                selfCheckQuestions: null,
                cards: null,
                selected: [],
                type: null,
            }
        },
        computed: {
            canSubmit: function () {
                return this.readyForCardSelection && this.selected.length;
            },
            readyForCardSelection: function () {
                return this.type;
            },
            selectAll: {
                get: function () {
                    return this.cards ? this.selected.length == this.cards.length : false;
                },
                set: function (value) {
                    let selected = [];
                    if (value) {
                        this.groupCards.forEach(function (card) {
                            selected.push(card.id);
                        });
                    }
                    this.selected = selected;
                }
            },
        },
        mounted() {
            this.setUp(this.$route.query.groupId);
        },
        methods: {
            cancel() {
                this.$router.push('/resources/card-all');
            },
            setUp(groupId) {
                axios.get('/nova/cards-by-group/' + groupId).then(response => {
                    this.groupCards = response.data;
                });

                axios.get('/nova/card-types').then(response => {
                  this.cardTypes = response.data;
                });
            },
            sendBackToCardSelection() {
                this.$router.push('/resources/card-all');
            },
            submitCards() {
                let postData = {
                    cardsToChange: this.selected,
                    type: this.type,
                };
                axios.post('/nova/change-card-type/', postData)
                    .then(function (response) {
                        this.setFinalDestination();
                    }.bind(this))
                    .catch(function (error) {
                        let response = error.response;
                        if (response.status === 422) {
                            let errors = response.data.errors;
                            let messages = [];
                            object.entries(errors).foreach(([key, val]) => {
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
