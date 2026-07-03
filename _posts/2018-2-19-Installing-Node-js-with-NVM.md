---
layout: post
title: Installing Node.js with NVM
description: NVM is a great tool that enables the user to switch beetween differents versions of Node.js.
tags: tutorial
---

NVM (Node Version Manager) is a great tool that enables the user to switch beetween differents versions of Node.js. Here's a quick introduction on how to install, use it and take advantage of all its features.

**Fist step : setting up NVM**

As explained in the Readme file from NVM source repository => [https://github.com/creationix/nvm](https://github.com/creationix/nvm), you will have to launch the install script using curl :
```bash
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
```

or Wget :
```bash
wget -qO- https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
```

It will download all the files in a freshly created `~/.nvm` folder.

Then do:
```bash
source ~/.bashrc
```

You should now be able to use the NVM CLI. Double check by typing `nvm --version`.
```bash
$ nvm --version
0.32.0
```

## Playing around with NVM

Once you've completed the setup of NVM, you can install and start using different versions of Node.js and io.js just by executing the different nvm commands.  
First of all, we need to install a Node.js or io.js version in our system.  
In this case, NVM comes quite handy because we just need to type :

```bash
$ nvm install stable
####################################### 100,0%
Now using node v6.7.0
```

to get the latest v0.10.x release of Node.js. You can basically install any version you want with the following syntax:

`nvm install` + version name (example: `nvm install 0.10` to get the latest Node.js stable version)

You may have noticed that NVM uses the newly installed version straight away. To get a list of all the versions installed so far, simply type `nvm ls`:

```bash
$ nvm ls
->       v6.6.0
          v6.7.0
default -> 6.6.0 (-> v6.6.0)
node -> stable (-> v6.7.0) (default)
stable -> 6.7 (-> v6.7.0) (default)
```

In the expample above, you have, first, all the versions (the green one being the version in use) followed by the different aliases for the specific versions.  
If you want to check how many versions are available for install in the remote repository, type `nvm ls-remote`.

To create an alias or symply modify an existing alias, symply use :  
`nvm alias name_of_alias version_number`

For example `nvm alias stable 0.10.36` will set **stable** as the Node.js 0.10.36 version.  
`nvm alias default stable` will set the stable (0.10.36 in our previous example) version as the default version for Node.js. You can even go further and create your own aliases for any version.

To delete an alias, type `nvm unalias name_of_alias`.

Now you can start using Node.js and io.js. However, after doing all those steps, we get to the point where we want to be able to switch easily between the different versions of our platforms.

`nvm use` is here for that purpose. Execute the command `nvm use version_number` or `nvm use name_of_alias` to start using any version instantly.

After executing the `nvm use`, you also want to make sure that you're using the right version. `nvm current` will display the version of Node.js or io.js being used in your system. Below is an illustrated example of what it does:

```bash
$ nvm current
v0.10.36
$ nvm use unstable
Now using node v0.11.15
$ nvm current
v0.11.15
```

Again, everything written here is also clearly explained by Creationix in the Readme from the NVM repo ([https://github.com/creationix/nvm](https://github.com/creationix/nvm)). Also, executing `nvm` alone or `nvm help` will display a comprehensive list of all the commands along with a brief description.

## Note regarding npm packages

This is something a lot of people ignore when using NVM and don't understand why a Node.js package installed globally (with the `npm install -g` command) suddenly dissappears after switching to another version. In fact, after a global installation of a package, NVM simply moves all the package files in the `node_modules` folder specific to the version in use only. When you use another version, the packages installed with the previous version won't be in the `node_modules` folder of the new version. It's just not there, but you can solve that by running the `npm install -g` command again.

## Conclusion

Flexibility, simplicity and reliability. As a developer, these are the three only things I look for in a tool. Node Version Manager is great because it happens to offer all of them. With the growing use of Node.js and all the updates and new versions coming in the future, NVM clearly stands out as convenient tool to sort all your different versions and keep your code up-to-date.
