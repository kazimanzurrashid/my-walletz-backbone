var expect = chai.expect;

describe('Application', function() {

    describe('.start', function() {
        var stubbedContext;
        var stubbedMembershipView;
        var stubbedProfileView;
        var spiedEventsTrigger;
        var stubbedRouter;

        before(function() {
            stubbedContext = sinon.stub(Application, 'Context', function() {
                return {
                    isUserSignedIn: function () { },
                    userSignedIn: function () { },
                    userSignedOut: function () { }
                };
            });

            stubbedMembershipView = sinon.stub(
                Application.Views,
                'Membership',
                function() {
                    return {};
                });

            stubbedProfileView = sinon.stub(
                Application.Views,
                'Profile',
                function() {
                    return {};
                });

            spiedEventsTrigger = sinon.spy(Application.events, 'on');

            stubbedRouter = sinon.stub(Application, 'Router', function() {
                return {
                    navigate: function() {
                    }
                };
            });

            try {
                Application.start();
            } catch(e) {
            }
        });

        describe('view creation', function() {
            it('creates membership view', function() {
                expect(Application.membershipView).to.exist;
            });

            it('creates profile view', function() {
                expect(Application.profileView).to.exist;
            });
        });

        describe('application events', function() {

            describe('subscription', function() {
                it('subscribe to myAccount application event', function() {
                    expect(spiedEventsTrigger)
                        .to.have.been.calledWith('myAccount');
                });

                it('subscribe to signedIn application event', function() {
                    expect(spiedEventsTrigger)
                        .to.have.been.calledWith('signedIn');
                });

                it('subscribe to passwordResetRequested application event', function() {
                    expect(spiedEventsTrigger)
                        .to.have.been.calledWith('passwordResetRequested');
                });

                it('subscribe to signedUp application event', function() {
                    expect(spiedEventsTrigger)
                        .to.have.been.calledWith('signedUp');
                });

                it('subscribe to passwordChanged application event', function() {
                    expect(spiedEventsTrigger)
                        .to.have.been.calledWith('passwordChanged');
                });

                it('subscribe to signedOut application event', function() {
                    expect(spiedEventsTrigger)
                        .to.have.been.calledWith('signedOut');
                });
            });

            describe('handling', function() {
                var stubbedShowInfoBar;
                var stubbedDelay;

                before(function() {
                    stubbedShowInfoBar = sinon.stub($, 'showInfobar', function() {
                    });
                    stubbedDelay = sinon.stub(_, 'delay');
                    stubbedDelay.withArgs(sinon.match.func, sinon.match.number);
                });

                describe('myAccount', function() {
                    var spiedEventsTrigger;

                    before(function() {
                        spiedEventsTrigger = sinon.spy(
                            Application.events,
                            'trigger');
                    });

                    describe('user signed in', function() {
                        var stubbedIsUserSignedIn;
                        
                        before(function() {
                            stubbedIsUserSignedIn = sinon.stub(
                                Application.context,
                                'isUserSignedIn',
                                function() {
                                    return true;
                                });
                            Application.events.trigger('myAccount');
                        });

                        it('triggers showProfile', function() {
                            expect(spiedEventsTrigger)
                                .to.have.been.calledWith('showProfile');
                        });

                        after(function() {
                            stubbedIsUserSignedIn.restore();
                        });
                    });

                    describe('user not signed in', function() {
                        var stubbedIsUserSignedIn;

                        before(function() {
                            stubbedIsUserSignedIn = sinon.stub(
                                Application.context,
                                'isUserSignedIn',
                                function() {
                                    return false;
                                });
                            Application.events.trigger('myAccount');
                        });

                        it('triggers showMembership', function() {
                            expect(spiedEventsTrigger)
                                .to.have.been.calledWith('showMembership');
                        });

                        after(function() {
                            stubbedIsUserSignedIn.restore();
                        });
                    });

                    after(function() {
                        spiedEventsTrigger.reset();
                        spiedEventsTrigger.restore();
                    });
                });

                describe('signedIn', function() {
                    var spiedContextUserSignedIn;
                    
                    before(function () {
                        spiedContextUserSignedIn = sinon.spy(
                            Application.context,
                            'userSignedIn');
                        Application.userSignnedIn = false;
                        Application.events.trigger('signedIn');
                        stubbedDelay.callArg(0);
                    });

                    it('calls context #userSignedIn', function () {
                        expect(spiedContextUserSignedIn)
                            .to.have.been.calledOnce;
                    });

                    it('shows info bar', function() {
                        expect(stubbedShowInfoBar)
                            .to.have.been.called;
                    });

                    after(function() {
                        spiedContextUserSignedIn.restore();
                        stubbedShowInfoBar.reset();
                    });
                });

                describe('passwordResetRequested', function() {
                    before(function() {
                        Application.events.trigger('passwordResetRequested');
                        stubbedDelay.callArg(0);
                    });

                    it('shows info bar', function() {
                        expect(stubbedShowInfoBar).to.have.been.called;
                    });

                    after(function() {
                        stubbedShowInfoBar.reset();
                    });
                });

                describe('signedUp', function() {
                    before(function() {
                        Application.events.trigger('signedUp');
                        stubbedDelay.callArg(0);
                    });

                    it('shows info bar', function() {
                        expect(stubbedShowInfoBar).to.have.been.called;
                    });

                    after(function() {
                        stubbedShowInfoBar.reset();
                    });
                });

                describe('passwordChanged', function() {
                    before(function() {
                        Application.events.trigger('passwordChanged');
                        stubbedDelay.callArg(0);
                    });

                    it('shows info bar', function() {
                        expect(stubbedShowInfoBar).to.have.been.called;
                    });

                    after(function() {
                        stubbedShowInfoBar.reset();
                    });
                });

                describe('signedOut', function() {
                    var spiedContextUserSignedOut;

                    before(function() {
                        spiedContextUserSignedOut = sinon.spy(
                            Application.context,
                            'userSignedOut');
                        Application.events.trigger('signedOut');
                        stubbedDelay.callArg(0);
                    });

                    it('calls context #userSignedOut', function () {
                        expect(spiedContextUserSignedOut)
                            .to.have.been.calledOnce;
                    });

                    it('shows info bar', function() {
                        expect(stubbedShowInfoBar).to.have.been.called;
                    });

                    after(function() {
                        spiedContextUserSignedOut.restore();
                        stubbedShowInfoBar.reset();
                    });
                });

                after(function() {
                    stubbedShowInfoBar.restore();
                    stubbedDelay.restore();
                });
            });
        });

        it('creates router', function() {
            expect(Application.router).to.exist;
        });

        it('creates context', function() {
            expect(Application.context).to.exist;
        });

        after(function() {
            stubbedContext.restore();
            stubbedMembershipView.restore();
            stubbedProfileView.restore();
            spiedEventsTrigger.restore();
            stubbedRouter.restore();
        });
    });
});