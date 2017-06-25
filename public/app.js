var todoList = angular.module("todoApp",['ngRoute','firebase'])

todoList.config(function($routeProvider) {
    $routeProvider
        .when("/",{templateUrl:"views/login.html"})
        .when("/home",{templateUrl:"views/home.html"})
        .when("/list/:listname",{templateUrl:"views/list.html"})
        .otherwise({redirectTo:"/"})
});

todoList.controller("loginCtrl", function($firebaseAuth, $location) {
    var auth =  $firebaseAuth();

    this.loginWithGoogle = function() {
        var promise = auth.$signInWithPopup("google");


        promise.then(function(result) {
        console.log("Signed in as:", result);
        this.user = result.user;
        $location.path("/home");
        })
        .catch(function(error) {
        console.error("Authentication failed:", error);
        });
    };

    this.loginWithFacebook = function() {
        var promise = auth.$signInWithPopup("facebook");


        promise.then(function(result) {
        console.log("Signed in as:", result);
        this.user = result.user;
        $location.path("/home");
        })
        .catch(function(error) {
        console.error("Authentication failed:", error);
        });
    };

    this.loginWithTwitter = function() {
        var promise = auth.$signInWithPopup("twitter");


        promise.then(function(result) {
        console.log("Signed in as:", result);
        this.user = result.user;
        $location.path("/home");
        })
        .catch(function(error) {
        console.error("Authentication failed:", error);
        });
    };

    this.loginWithGithub = function() {
        var promise = auth.$signInWithPopup("github");


        promise.then(function(result) {
        console.log("Signed in as:", result);
        this.user = result.user;
        $location.path("/home");
        })
        .catch(function(error) {
        console.error("Authentication failed:", error);
        });
    };
});

todoList.controller("homeCtrl", function($firebaseArray, $firebaseAuth) {
    var auth =  $firebaseAuth();
    this.user = auth.$getAuth();
    var listRef = firebase.database().ref(this.user.uid+"/lists");
    var list = $firebaseArray(listRef);
    this.lists = list;
    
    
    this.addList = function() {
        this.lists.$add({"name":this.list});
        this.list = "";
    }

    this.removeList = function(i) {
        if(confirm("Are you sure you want to delete "+this.lists+" list?")) {
           console.log(i);
            this.lists.$remove(i);
            console.log(this.lists); 
        }
    };

});

todoList.controller("todoCtrl", function($firebaseArray, $firebaseAuth ,$routeParams) {
    var auth =  $firebaseAuth();
    this.user = auth.$getAuth();
    this.tasks = [];
    this.name=$routeParams.listname;
    var taskRef = firebase.database().ref(this.user.uid+'/tasks').child(this.name);
    this.tasks = $firebaseArray(taskRef);
    this.editMode = false;
    this.savedIndex = 0;
    this.currentID = 0;
    this.count = 0;

    // this.tasks.$loaded().then(function() {
    //     // for (var i=0;i<this.tasks.length;i++) {
    //     //     if (this.tasks[i].status)
    //     //         this.count = this.count + 1;
    //     // }
    //     console.log("working")
    // });

    this.addTask = function() {
        var obj = {};
        obj.title = this.task;
        obj.status = false;
        this.currentID += 1;
        obj.id = this.currentID;
        this.tasks.$add(obj);
        this.task = "";
        console.log(this.tasks);
    }

    

    this.deleteTask = function(id) {
        if(confirm("Are you sure you want to delete "+this.tasks+" task?")) {
            for(var i=0;i<this.tasks.length;i++) {
                if(this.tasks[i].id == id)
                    break;
            }
            this.tasks.$remove(i);
            console.log(this.tasks);
        }
    }

    this.editTask = function(id) {
        for(var i=0;i<this.tasks.length;i++) {
            if(this.tasks[i].id == id)
                break;
        }
        console.log(this.tasks.length, i);
        this.editMode = true;
        this.savedIndex = i;
        this.task = this.tasks[i].title;

    }

    this.updateTask = function() {
        this.editMode = false;
        this.tasks[this.savedIndex].title = this.task;
        this.tasks.$save(this.savedIndex);
        this.task = "";
    }

    this.setStatus = function(id) {
        for(var i=0;i<this.tasks.length;i++) {
            if(this.tasks[i].id == id)
                break;
        }
        this.tasks[i].status = !this.tasks[i].status;
        if(this.tasks[i].status)
            this.count += 1;
        if(!this.tasks[i].status)
            this.count -= 1;
        this.tasks.$save(i);
        this.tasks.$save(this.count);
        console.log(this.tasks);
    }  

    this.moveUp = function(id) {
            for(var i=0; i<this.tasks.length; i++) {
                if(this.tasks[i].id == id && i!=0) {
                    
                    var temp = this.tasks[i-1].name;
                    this.tasks[i-1].name = this.tasks[i].name;
                    this.tasks[i].name = temp;
                    
                    var temp = this.tasks[i-1].id;
                    this.tasks[i-1].id = this.tasks[i].id;
                    this.tasks[i].id = temp;

                    var temp = this.tasks[i-1].status;
                    this.tasks[i-1].status = this.tasks[i].status;
                    this.tasks[i].status = temp;

                    this.tasks.$save(i-1);
                    this.tasks.$save(i);
                }

            }
        }

        this.moveDown = function(id) {
        for(var i=0; i<this.tasks.length; i++) {
            if(this.tasks[i].id == id && j!=this.tasks.length-1) {
                
                var temp = this.tasks[i+1].name;
                this.tasks[i+1].name = this.tasks[i].name;
                this.tasks[i].name = temp;
                
                var temp = this.tasks[i+1].id;
                this.tasks[i+1].id = this.tasks[i].id;
                this.tasks[i].id = temp;

                var temp = this.tasks[i+1].status;
                this.tasks[i+1].status = this.tasks[i].status;
                this.tasks[i].status = temp;

                this.tasks.$save(i);
                this.tasks.$save(i+1);
            }

        }
    }

});
