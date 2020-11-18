<template>
    <div>
        <form autocomplete="off">
            <div class="mb-8">
                <h1 class="mb-3 text-90 font-normal text-2xl">
                    Bulk Tag Profile Answers
                </h1>

                <div class="card">
                    <div v-if="finalDestination">
                        <div class="py-6 px-8 w-1/2">
                            <label v-if="untag">Untagged These Answers:</label>
                            <label v-else>Tagged To These Answers:</label>
                            <ul>
                                <li class="py-1" v-for="answer in selected">{{getAnswerText(answer)}}</li>
                            </ul>
                            <p class="py-4" v-if="untag">Removed these cards: {{cards}}</p>
                            <p class="py-4" v-else>Added these cards: {{cards}}</p>
                            <button
                                    type="button"
                                    class="btn btn-default btn-primary inline-flex items-center relative"
                                    v-on:click="sendBackToCardSelection"
                            >Return to All Cards
                            </button>
                        </div>
                    </div>
                    <div v-else>
                        <div class="flex border-b border-40">
                            <div class="w-1/5 px-8 py-6">
                                <label for="appType">App Type</label>
                            </div>
                            <div class="py-6 px-8 w-1/2">
                                <select id="actionType"
                                        class="w-full form-control form-select"
                                        v-model="appType"
                                        v-on:change="getProfileAnswers"
                                >
                                    <option disabled value="">Please select one</option>
                                    <option v-for="type in appTypes" v-bind:value="type.id">{{type.slug}}</option>
                                </select>
                            </div>
                        </div>

                        <div v-if="readyForCardSelection">
                            <div class="flex border-b border-40">
                                <div class="w-1/5 px-8 py-6">
                                    <label>
                                        Untag cards?
                                    </label>
                                </div>
                                <div class="py-6 px-8 mx-8 w-full">
                                    <label>
                                        <input type="checkbox"
                                               class="checkbox mt-2"
                                               v-on:click="setUntag"
                                               v-bind:value="this.untag"/>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div v-if="readyForCardSelection">
                            <div class="flex border-b border-40">
                                <div class="w-1/5 px-8 py-6">
                                    <label>
                                        Profile Answers
                                    </label>
                                </div>
                                <div class="py-6 px-8 mx-8 w-full">
                                    <label class="label-select-all">
                                        <input type="checkbox"
                                               class="checkbox mt-2"
                                               v-model="selectAll"/>
                                        Select All
                                    </label>
                                    <div v-for="answer in profileAnswers" v-bind:key="answer.id">
                                        <label>
                                            <input type="checkbox"
                                                   class="checkbox mt-2"
                                                   v-model="selected"
                                                   v-bind:value="answer.id"/>
                                            {{answer.answer}}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="!finalDestination" class="flex items-center">
                <button
                        v-on:click="cancel"
                        class="btn btn-link dim cursor-pointer text-80 ml-auto mr-6"
                >Cancel
                </button>
                <button
                        type="button"
                        v-bind:disabled="!canSubmit"
                        v-if="appType"
                        v-on:click="submitClone"
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
                appType: null,
                appTypes: null,
                profileAnswers: null,
                cards: null,
                finalDestination: false,
                selected: [],
                untag: false,
            }
        },
        computed: {
            canSubmit: function () {
                return this.readyForCardSelection && this.selected.length;
            },
            readyForCardSelection: function () {
                return this.appType;
            },
            selectAll: {
                get: function () {
                    return this.cards ? this.selected.length == this.cards.length : false;
                },
                set: function (value) {
                    let selected = [];
                    if (value) {
                        this.profileAnswers.forEach(function (answer) {
                            selected.push(answer.id);
                        });
                    }
                    this.selected = selected;
                }
            },
        },
        mounted() {
            this.setUp(this.$route.query.cards);
        },
        methods: {
            cancel() {
                this.$router.push('/resources/card-alls');
            },
            setUp(cards) {
                // this may also will need to passthrough the card Ids
                this.cards = cards;
                axios.get('/nova/app-types/').then(response => {
                    this.appTypes = response.data;
                });
            },
            getAnswerText(answerId) {
                return this.profileAnswers.filter(q => q.id === answerId)[0].answer;
            },
            getProfileAnswers() {
                axios.get('/nova/profile-answers/' + this.appType).then(response => {
                    this.profileAnswers = response.data;
                });
            },
            sendBackToCardSelection() {
                this.$router.push('/resources/card-alls');
            },
            setFinalDestination() {
                this.finalDestination = true;
            },
            setUntag() {
                this.untag = !this.untag;
            },
            submitClone() {
                let postData = {
                    answersToTag: this.selected,
                    cards: this.cards,
                    untag: this.untag,
                };
                axios.post('/nova/tag/', postData)
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
