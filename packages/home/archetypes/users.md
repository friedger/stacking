---
title: "{{ (print "User " .Name) | title }}"
date: {{ .Date }}
user: {{ int .Name }}
layout: "users"
---
